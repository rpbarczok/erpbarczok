import '../../style.css'
import './companies.css'
import { Col, Row } from 'react-bootstrap'
import Heading from '../headings/heading.jsx'
import EditCompanies from './edit.companies.jsx'
import SearchCompanies from './search.companies.jsx'
import AddCompanies from './add.companies.jsx'
import ListCompanies from './list.companies.jsx'
import { useState, useEffect, MouseEvent, useReducer } from 'react'
import { DataWithMeta } from '../forms.jsx'
import { client } from '../../utils/openapiclientaxios.js'
import { removeBeforeLastDigits } from '../../utils/removeBeforeLastDigits.js'
import { Companytype } from 'components/admin/companytypes/companytypes.jsx'
import { Notifiers, Notifier } from 'components/notifiers/notifiers.jsx'
import { changeCompanyReducer } from './company.reducer.js'
import { useNotifier } from 'components/notifiers/usenotifier.js'

export interface Company {
    "name": string
    "companytype": string
    "abbr"?: string
    "www"?: string
}

export interface ChangeCompanyAction {
    type: 'nameChange' | 'abbrChange' | 'wwwChange' | 'companytypeChange' | 'companyChange'
    newValue: string | DataWithMeta<Company>
}

interface CompanyInterface {
    listCompanytypes: DataWithMeta<Companytype>[]
}

export const blandCompany: DataWithMeta<Company> = { "meta": { "location": 0, "etag": "" }, "data": { "name": "", "companytype": "default", "abbr": "", "www": "" } }

export default function Companies({ listCompanytypes }: CompanyInterface) {

    const [companyIsChanged, setCompanyIsChanged] = useState<boolean>(true)
    const [listCompanies, setListCompanies] = useState<DataWithMeta<Company>[]>([])
    const [activeCompany, setActiveCompany] = useState<DataWithMeta<Company>>(blandCompany)
    const [search, setSearch] = useState<string>("")
    const [isNew, setIsNew] = useState<boolean>(false)
    const [show, setShow] = useState<boolean>(false) // to handle the modal
    const [notifiers, addNotifier, removeNotifier] = useNotifier()
    const [changeCompany, changeCompanyDispatch] = useReducer(changeCompanyReducer, blandCompany)

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
                        changeCompanyDispatch({ type: 'companyChange', newValue: company })
                    }
                })
                .catch(error => {
                    const notifier: Notifier = {
                        variant: 'danger',
                        message: `Diese Firma wurde nicht gefunden.`,
                        label: 'mainCompanies'
                    }
                    addNotifier(notifier)
                })
        }
    }

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (changeCompany.data.name !== "") {
            if (changeCompany.meta.location === 0) {
                client.postCompany(null, changeCompany.data)
                    .then((res) => {
                        handleChangeActive(Number(removeBeforeLastDigits(res.headers.location)))
                        const notifier: Notifier = {
                            message: `Neue Firma erfolgreich erstellt`,
                            variant: 'success',
                            label: 'mainCompanies'
                        }
                        addNotifier(notifier)
                        setCompanyIsChanged(true)
                        setIsNew(true)
                        setShow(false)
                        changeCompanyDispatch({ type: 'companyChange', newValue: blandCompany })
                    })
                    .catch((error) => {
                        const notifier: Notifier = {
                            variant: 'danger',
                            message: `Fehler bei Erstellung der neuen Firma: ${error.message}`,
                            label: 'addCompanies'
                        }
                        addNotifier(notifier)
                    })
            } else {
                if (changeCompany.data === activeCompany.data) {
                    const notifier: Notifier = {
                        variant: 'info',
                        message: `Es wurden keine Änderungen der Daten der Firma '${changeCompany.data.name}' eingegeben.`,
                        label: 'mainCompanies'
                    }
                    addNotifier(notifier)
                } else {
                    client.putCompanyById({ id: changeCompany.meta.location, "if-match": changeCompany.meta.etag },
                        changeCompany.data)
                        .then((res) => {
                            const notifier: Notifier = {
                                variant: 'success',
                                message: `Neue Firma '${changeCompany.data.name}' erfolgreich überarbeitet.`,
                                label: 'mainCompanies'
                            }
                            addNotifier(notifier)
                            setCompanyIsChanged(true)
                        })
                        .catch(function (error) {
                            const notifier: Notifier = {
                                variant: 'danger',
                                message: `Fehler beim Abspeichern der Firmendaten: ${error.message}`,
                                label: 'mainCompanies'
                            }
                            addNotifier(notifier)
                        })
                }
            }
        }
    }

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const userConfirmed = window.confirm("Willst du wirklich die Firma löschen?")
        if (userConfirmed) {
            client.deleteCompanyById(activeCompany.meta.location)
                .then((res) => {
                    setCompanyIsChanged(true)
                    const notifier: Notifier = {
                        variant: 'warning',
                        message: `Firma wurde gelöscht. Aktuell gibt es keine Möglichkeit, die Daten zurückzuholen`,
                        label: 'mainCompanies'
                    }
                    addNotifier(notifier)
                })
                .catch(error => {
                    const notifier: Notifier = {
                        variant: 'danger',
                        message: `Löschen der Firma hat nicht geklappt: ${error.message}`,
                        label: 'mainCompanies'
                    }
                    addNotifier(notifier)
                })
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
                        changeCompanyDispatch={changeCompanyDispatch}
                        setShow={setShow}
                        show={show}
                        notifiers={notifiers}
                        removeNotifier={removeNotifier}
                    />
                </Col>
                <Col>
                </Col>
            </Row>
            <hr />
            <Notifiers
                notifiers={notifiers}
                removeNotifier={removeNotifier}
                label='mainCompanies' />
            <Row id="edit">
                {activeCompany.meta.location === 0 ?
                    <p>Keine Firma gefunden</p> :
                    <EditCompanies
                        key={activeCompany.meta.location}
                        listCompanytypes={listCompanytypes}
                        changeCompany={changeCompany}
                        changeCompanyDispatch={changeCompanyDispatch}
                        handleSubmit={handleSubmit}
                        handleDelete={handleDelete}
                    />}
            </Row>
        </>
    )
}