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
import { Notifications, Notification } from 'components/notifications/notifications.jsx'
import { changeCompanyReducer } from './company.reducer.js'
import { useNotification } from 'components/notifications/usenotification.js'

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
    const [notifications, addNotification, removeNotification] = useNotification()
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
                        const notification: Notification = {
                            variant: 'success',
                            message: `Neue Firma '${changeCompany.data.name}' erfolgreich erstellt`,
                            label: 'mainCompanies'
                        }
                        addNotification(notification)
                        setCompanyIsChanged(true)
                        setIsNew(true)
                        setShow(false)
                        changeCompanyDispatch({ type: 'companyChange', newValue: blandCompany })
                    })
                    .catch((error) => {
                        const notification: Notification = {
                            variant: 'danger',
                            message: `Fehler bei Erstellung der neuen Firma: ${error.message}`,
                            label: 'addCompanies'
                        }
                        addNotification(notification)
                    })
            } else {
                if (changeCompany.data === activeCompany.data) {
                    const notification: Notification = {
                        variant: 'info',
                        message: `Es wurden keine Änderungen der Daten der Firma '${changeCompany.data.name}' eingegeben.`,
                        label: 'mainCompanies'
                    }
                    addNotification(notification)
                } else {
                    client.putCompanyById({ id: changeCompany.meta.location, "if-match": changeCompany.meta.etag },
                        changeCompany.data)
                        .then((res) => {
                            const notification: Notification = {
                                variant: 'success',
                                message: `Neue Firma '${changeCompany.data.name}' erfolgreich überarbeitet.`,
                                label: 'mainCompanies'
                            }
                            addNotification(notification)
                            setCompanyIsChanged(true)
                        })
                        .catch(function (error) {
                            const notification: Notification = {
                                variant: 'danger',
                                message: `Fehler beim Abspeichern der Firmendaten: ${error.message}`,
                                label: 'mainCompanies'
                            }
                            addNotification(notification)
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
                    const notification: Notification = {
                        variant: 'warning',
                        message: `Firma wurde gelöscht. Aktuell gibt es keine Möglichkeit, die Daten zurückzuholen`,
                        label: 'mainCompanies'
                    }
                    addNotification(notification)
                })
                .catch(error => {
                    const notification: Notification = {
                        variant: 'danger',
                        message: `Löschen der Firma hat nicht geklappt: ${error.message}` ,
                        label: 'mainCompanies'
                    }
                    addNotification(notification)
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
                        notifications={notifications}
                        removeNotification={removeNotification}
                    />
                </Col>
                <Col>
                </Col>
            </Row>
            <hr />
            <Notifications
                notifications={notifications}
                removeNotification={removeNotification} 
                label='mainCompanies'/>
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