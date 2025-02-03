import '../../../style.css'
import '../admin.css'
import { ListGroup, Row } from 'react-bootstrap'
import { useState } from 'react'
import { DataWithMeta } from '../../forms.jsx'
import AddCompanytypes from './add.companytypes.jsx'
import ListCompanytypes from './list.comanytypes.jsx'
import InputCompanytypes from './input.companytypes.jsx'
import { client } from '../../../utils/openapiclientaxios.js'

export interface Companytype {
    "name": string
}

interface CompanytypesInterface {
    listCompanytypes: DataWithMeta<Companytype>[]
    setIsCompanytypeChanged: React.Dispatch<React.SetStateAction<boolean>>
}

const Companytypes = ({listCompanytypes, setIsCompanytypeChanged} : CompanytypesInterface) => {
    const [companytypeChange, setCompanytypeChange] = useState<DataWithMeta<Companytype> | undefined>({ meta: { location: 0, etag: "" }, data: { name: "" } })
    const [show, setShow] = useState<boolean>(false) // to handle the modal
    const [title, setTitle] = useState<string>("Firmenrolle")

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, companytype: DataWithMeta<Companytype>) => {
        e.preventDefault()
        const userConfirmed = window.confirm(`Willst du wirklich die Firmenrolle ${companytype.data.name} löschen?`)
        if (userConfirmed) {
            client.deleteCompanytypeById(companytype.meta.location)
                .then((res) => {
                    setIsCompanytypeChanged(true)
                    setShow(false)
                })
                .catch(function (error) {
                    throw error
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

    const handleSubmitEdit = (e: React.MouseEvent<Element>, companytype: DataWithMeta<Companytype>) => {
        e.preventDefault()
        if (companytype) {
            if (companytype.data.name !== '') {
                if (companytype.meta.location !== 0) {
                    client.putCompanytypeById(
                        companytype.meta.location, 
                        companytype.data, 
                        { 'headers': { 'location': 'companytypes/' + String(companytype.meta.location), 'if-match': companytype.meta.etag } })
                        .then((res) => {
                            setIsCompanytypeChanged(true)
                            setShow(false)
                            setCompanytypeChange(undefined)
                        })
                        .catch(function (error) {
                            throw error
                        })
                } else {
                    client.postCompanytype(null, companytype.data)
                        .then((res) => {
                            setIsCompanytypeChanged(true)
                            setCompanytypeChange(undefined)
                            setShow(false)
                        })
                }

            }
        }

    }

    return (
        <>
            <Row>
                <h1>Firmenrolle</h1>
            </Row>
            <Row>
                < ListGroup className="standardDesign" id="company-list" >
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
                    handleSubmit={handleSubmitEdit}
                    companytype={companytypeChange} setCompanytype={setCompanytypeChange} />
            </Row>
        </>
    )
}

export default Companytypes