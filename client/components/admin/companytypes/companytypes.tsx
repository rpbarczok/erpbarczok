import '../../../style.css'
import '../admin.css'
import { ListGroup, Row } from 'react-bootstrap'
import { useState } from 'react'
import { DataWithMeta } from '../../forms.jsx'
import AddCompanytypes from './add.companytypes.jsx'
import ListCompanytypes from './list.comanytypes.jsx'
import InputCompanytypes from './input.companytypes.jsx'
import { client } from '../../../utils/openapiclientaxios.js'
import { Notifier, Notifiers } from 'components/notifiers/notifiers.jsx'
import { useNotifier } from 'components/notifiers/usenotifier.js'

export interface Companytype {
    "name": string
}

interface CompanytypesInterface {
    listCompanytypes: DataWithMeta<Companytype>[]
    setIsCompanytypeChanged: React.Dispatch<React.SetStateAction<boolean>>
}

const Companytypes = ({ listCompanytypes, setIsCompanytypeChanged }: CompanytypesInterface) => {
    const [companytypeChange, setCompanytypeChange] = useState<DataWithMeta<Companytype> | undefined>({ meta: { location: 0, etag: "" }, data: { name: "" } })
    const [show, setShow] = useState<boolean>(false) // to handle the modal
    const [title, setTitle] = useState<string>("Firmenrolle")
    const [notifiers, addNotifier, removeNotifier] = useNotifier()

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, companytype: DataWithMeta<Companytype>) => {
        e.preventDefault()
        const userConfirmed = window.confirm(`Willst du wirklich die Firmenrolle ${companytype.data.name} löschen?`)
        if (userConfirmed) {
            client.deleteCompanytypeById(companytype.meta.location)
                .then((res) => {
                    const notifier: Notifier = {
                        message: 'Die Firmenrolle wurde erfolgreich gelöscht.',
                        variant: 'info',
                        label: 'mainCompanytypes'
                    }
                    addNotifier(notifier)
                    setIsCompanytypeChanged(true)
                    setShow(false)
                })
                .catch(error => {
                    if (error.status === 409) {
                        const notifier: Notifier = {
                            message: `Die Firmenrolle konnte nicht gelöscht werden, weil sie noch referenziert wird.`,
                            variant: 'danger',
                            label: 'mainCompanytypes'
                        }
                        addNotifier(notifier)
                    } else {
                        const notifier: Notifier = {
                            message: `Fehler beim Löschen der Firmenrolle: ${error.message}`,
                            variant: 'danger',
                            label: 'mainCompanytypes'
                        }
                        addNotifier(notifier)
                    }
                })
        }
    }

    const handleModal = (e: React.MouseEvent<HTMLButtonElement>, companytype: DataWithMeta<Companytype> | undefined) => {
        e.preventDefault()
        if (companytype) {
            setCompanytypeChange(companytype)
            setTitle("Firmenrolle " + companytype.data.name + " ändern")
            setShow(true)
        } else {
            setCompanytypeChange(undefined)
            setTitle("Firmenrolle hinzufügen")
            setShow(true)
        }
    }

    const handleSubmit = (e: React.MouseEvent<Element>, companytype: DataWithMeta<Companytype>) => {
        e.preventDefault()
        if (companytype) {
            if (companytype.data.name !== '') {
                if (companytype.meta.location !== 0) {
                    client.putCompanytypeById({ id: companytype.meta.location, 'if-match': companytype.meta.etag }, companytype.data)
                        .then((res) => {
                            const notifier: Notifier = {
                                message: `Die Firmenrolle wurde erfolgreich geändert.`,
                                variant: 'success',
                                label: 'mainCompanytypes'
                            }
                            addNotifier(notifier)
                            console.log(notifier)
                            setIsCompanytypeChanged(true)
                            setShow(false)
                            setCompanytypeChange(undefined)
                        })
                        .catch(error => {
                            const notifier: Notifier = {
                                message: `Fehler beim Ändern der Firmenrolle: ${error.message}`,
                                variant: 'danger',
                                label: 'mainCompanytypes'
                            }
                            addNotifier(notifier)
                        })
                } else {
                    client.postCompanytype(null, companytype.data)
                        .then((res) => {
                            const notifier: Notifier = {
                                message: `Die neue Firmenrolle wurde erfolgreich abgespeichert.`,
                                variant: 'success',
                                label: 'mainCompanytypes'
                            }
                            addNotifier(notifier)
                            setIsCompanytypeChanged(true)
                            setCompanytypeChange(undefined)
                            setShow(false)
                        })
                        .catch(error => {
                            const notifier: Notifier = {
                                message: `Fehler beim Speichern der neuen Firmenrolle: ${error.message}`,
                                variant: 'danger',
                                label: 'mainCompanytypes'
                            }
                            addNotifier(notifier)
                        })
                }
            } else {
                const notifier: Notifier = {
                    message: `Bitte eine Bezeichnung für die Firmenrolle eingeben.`,
                    variant: 'info',
                    label: 'addCompanytypes'
                }
                addNotifier(notifier)
            }
        } else {
            const notifier: Notifier = {
                message: `Bitte etwas eingeben.`,
                variant: 'info',
                label: 'addCompanytypes'
            }
            addNotifier(notifier)
        }
    }

    return (
        <>
            <Row>
                <h1>Firmenrolle</h1>
            </Row>
            <Row>
                <Notifiers notifiers={notifiers} removeNotifier={removeNotifier} label="mainCompanytypes" />
                <ListGroup className="standardDesign" key="company-list" >
                    <ListCompanytypes
                        listCompanytypes={listCompanytypes}
                        handleModal={handleModal}
                        handleDelete={handleDelete} />
                    <AddCompanytypes
                        handleModal={handleModal} />
                </ListGroup >
                <InputCompanytypes
                    title={title}
                    show={show} setShow={setShow}
                    handleSubmit={handleSubmit}
                    companytype={companytypeChange}
                    setCompanytype={setCompanytypeChange}
                    notifiers={notifiers}
                    removeNotifier={removeNotifier} />
            </Row>
        </>
    )
}

export default Companytypes