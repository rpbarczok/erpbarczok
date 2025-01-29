import '../../../style.css'
import '../admin.css'
import { ListGroup, Row } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { DataWithMeta } from 'components/app.jsx'
import { Companytype } from 'components/companies/companies.jsx'
import AddCompanytypes from './add.companytypes.admin.jsx'
import ListCompanytypes from './list.comanytypes.admin.jsx'
import InputCompanytypes from './input.companytypes.admin.jsx'


const Companytypes = () => {
    const [isChanged, setIsChanged] = useState<boolean>(true)
    const [listCompanytypes, setListCompanytypes] = useState<DataWithMeta<Companytype>[]>([])
    const [companytypeChange, setCompanytypeChange] = useState<DataWithMeta<Companytype> | undefined>({ meta: { location: "", etag: "" }, data: { name: "" } })
    const [show, setShow] = useState<boolean>(false) // to handle the modal
    const [title, setTitle] = useState<string>("Firmenrolle")

    useEffect(() => {
        if (isChanged) {
            axios.get("/companytypes/")
                .then(result => {
                    setListCompanytypes(result?.data)
                })
            setIsChanged(false)
        }
    }, [isChanged])

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, companytype: DataWithMeta<Companytype>) => {
        e.preventDefault()
        const userConfirmed = window.confirm(`Willst du wirklich die Firmenrolle ${companytype.data.name} löschen?`)
        if (userConfirmed) {
            axios.delete(companytype.meta.location)
                .then((res) => {
                    setIsChanged(true)
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
                if (companytype.meta.location !== '') {
                    axios
                        .put(
                            companytype.meta.location,
                            companytype.data,
                            { 'headers': { 'location': companytype.meta.location, 'if-match': companytype.meta.etag } })
                        .then((res) => {
                            setIsChanged(true)
                            setShow(false)
                            setCompanytypeChange(undefined)
                        })
                        .catch(function (error) {
                            throw error
                        })
                } else {
                    axios
                        .post(`/companytypes/`, companytype.data)
                        .then((res) => {
                            setIsChanged(true)
                            setCompanytypeChange(undefined)
                            setShow(false)
                        })
                }

            }
        }

    }

    //     const handleSubmitNew = (e: MouseEvent<HTMLButtonElement>) => {
    //     e.preventDefault()
    //     if (companytype.name !== "") {
    //         axios
    //             .post(`/companytypes/`, companytype)
    //             .then((res) => {
    //                 setIsChanged(true)
    //                 setCompanytype({
    //                     name: ""
    //                 })
    //                 setShow(false)
    //             })
    //     }
    // }

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