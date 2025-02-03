import '../../style.css'
import './companies.css'
import { Col, Row } from 'react-bootstrap'
import Heading from '../headings/heading.jsx'
import EditCompanies from './edit.companies.jsx'
import SearchCompanies from './search.companies.jsx'
import AddCompanies from './add.companies.jsx'
import ListCompanies from './list.companies.jsx'
import { useState, useEffect, MouseEvent } from 'react'
import { DataWithMeta } from '../forms.jsx'
import { client } from '../../utils/openapiclientaxios.js'
import { removeBeforeLastDigits } from '../../utils/removeBeforeLastDigits.js'
import { Companytype } from 'components/admin/companytypes/companytypes.jsx'
import { AlertNotes } from 'components/alerts/alertnotes.jsx'

export interface Company {
    "name": string
    "companytype": string
    "abbr"?: string
    "www"?: string
}

export interface AlertNote {
    variant: string
    key: string
    message: string
    isExpired: boolean
}

interface CompanyInterface {
    listCompanytypes: DataWithMeta<Companytype>[]
}

export const blandCompany = { "meta": { "location": 0, "etag": "" }, "data": { "name": "", "companytype": "default", "abbr": "", "www": "" } }

export default function Companies({ listCompanytypes }: CompanyInterface) {

    const [companyIsChanged, setCompanyIsChanged] = useState<boolean>(true)
    const [listCompanies, setListCompanies] = useState<DataWithMeta<Company>[]>([])
    const [activeCompany, setActiveCompany] = useState<DataWithMeta<Company>>(blandCompany)
    const [search, setSearch] = useState<string>("")
    const [isNew, setIsNew] = useState<boolean>(false)
    const [changeCompany, setChangeCompany] = useState<DataWithMeta<Company>>(blandCompany)
    const [show, setShow] = useState<boolean>(false) // to handle the modal
    const [alertNotes, setAlertNotes] = useState<AlertNote[]>([])

    useEffect(() => {
        if (companyIsChanged) {
            client.getCompanies()
                .then(result => {
                    const newList = result?.data.map(row => {
                        const newRow: DataWithMeta<Company> = {
                            meta: {
                                location: Number(removeBeforeLastDigits(row.meta.location)),
                                etag: row.meta.etag
                            },
                            data: row.data
                        }
                        return (newRow)
                    })
                    setListCompanies(newList)
                })
            setCompanyIsChanged(false)
        }
    }, [companyIsChanged])

    function handleChangeActive(active: number) {
        if (active === 0 || active === undefined) {
            setActiveCompany(blandCompany)
        } else {
            client.getCompanyById(active)
                .then(result => {
                    if (result.data) {
                        const company = { "meta": { 'location': Number(removeBeforeLastDigits(result.headers.location)), 'etag': result.headers.etag }, 'data': result.data }
                        setActiveCompany(company)
                        setChangeCompany(company)
                    }
                })
        }
    }

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (changeCompany.data.name !== "") {
            if (changeCompany.meta.location === 0) {
                console.log(changeCompany)
                client.postCompany(null, changeCompany.data)
                    .then((res) => {
                        handleChangeActive(Number(removeBeforeLastDigits(res.headers.location)))
                        setAlertNotes([
                            ...alertNotes,
                            {
                                variant: 'success',
                                key: `companyString${(Number(removeBeforeLastDigits(res.headers.location)))}`,
                                message: `Neue Firma '${changeCompany.data.name}' erfolgreich erstellt`,
                                isExpired: false
                            }
                        ])
                        setCompanyIsChanged(true)
                        setIsNew(true)
                        setShow(false)
                        setChangeCompany(blandCompany)
                    })
                    .catch((error) => {
                        setAlertNotes([
                            ...alertNotes,
                            {
                                variant: 'danger',
                                key: `companyString`,
                                message: `Fehler bei Erstellung der neuen Firma: ${error.message}`,
                                isExpired: false
                            }])
                    })
            } else {
                if (changeCompany.data === activeCompany.data) {
                    const key = `company${Date.now()}`

                    const alertNote =   {
                        variant: 'info',
                        key: key,
                        message: `Die Daten der Firma '${changeCompany.data.name}' wurden nicht verändert.`,
                        isExpired: false
                    }
                    setAlertNotes(a => [
                        ...a,
                        alertNote
                    ]
                    ),
                    setTimeout(() => setAlertNotes(a => a.filter(note => note !== alertNote)) ,5000)
                } else {
                    client.putCompanyById({ id: changeCompany.meta.location, "if-match": changeCompany.meta.etag },
                        changeCompany.data)
                        .then((res) => {
                            setAlertNotes([
                                ...alertNotes,
                                {
                                    variant: 'success',
                                    key: `company${String(changeCompany.meta.location)}`,
                                    message: `Neue Firma '${changeCompany.data.name}' erfolgreich überarbeitet.`,
                                    isExpired: false
                                }
                            ]
                            )
                            setCompanyIsChanged(true)
                        })
                        .catch(function (error) {
                            setAlertNotes([
                                ...alertNotes,
                                {
                                    variant: 'danger',
                                    key: `company${String(changeCompany.meta.location)}`,
                                    message: `Fehler beim Abspeichern der Firmendaten: ${error.message}`,
                                    isExpired: false
                                }
                            ]
                            )
                        })
                }
            }
        }
    }

    return (
        <>
            <Row id="heading">
                <Heading title="Stammdaten: Kunden, Lieferanten, Spediteure" cssClass="stammForm" />
            </Row>
            <Row className="suche">
                <Col>
                    <SearchCompanies search={search} setSearch={setSearch} />
                </Col>
                <Col>
                    <ListCompanies
                        search={search}
                        activeCompany={activeCompany} onChangeActive={handleChangeActive}
                        isNew={isNew} setIsNew={setIsNew}
                        listCompanies={listCompanies}
                    />
                </Col>
                <Col>
                    <AddCompanies
                        listCompanytypes={listCompanytypes}
                        handleSubmit={handleSubmit}
                        changeCompany={changeCompany}
                        setChangeCompany={setChangeCompany}
                        setShow={setShow}
                        show={show}
                        alertNotes={alertNotes}
                    />
                </Col>
                <Col>
                </Col>
            </Row>
            <hr />
            <AlertNotes alertNotes={alertNotes} setAlertNotes={setAlertNotes}/>
            <Row id="edit">
                {activeCompany.meta.location === 0 ?
                    <p>Keine Firma gefunden</p> :
                    <EditCompanies
                        key={activeCompany.meta.location}
                        setCompanyIsChanged={setCompanyIsChanged}
                        activeCompany={activeCompany}
                        listCompanytypes={listCompanytypes}
                        changeCompany={changeCompany}
                        setChangeCompany={setChangeCompany}
                        handleSubmit={handleSubmit}

                    />}
            </Row>
        </>
    )
}