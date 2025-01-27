import { Companytype } from "components/companies/companies.jsx"
import { DataWithMeta } from "app.jsx"
import { Button, ButtonGroup, Col, ListGroup } from "react-bootstrap"
import { Pencil, Trash } from "react-bootstrap-icons"
import { useState } from "react"
import axios from "axios"
import InputCompanytypes from "./input.companytypes.admin.jsx"

interface ListCompanytypesInterface {
    listCompanytypes: DataWithMeta<Companytype>[]
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>
}

const ListCompanytypes = ({ listCompanytypes, setIsChanged }: ListCompanytypesInterface) => {
    const [show, setShow] = useState<boolean>(false) // to handle the modal
    const [companytypeChange, setCompanytypeChange] = useState<Companytype>({ name: "" })

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, companytype: DataWithMeta<Companytype>) => {
        e.preventDefault()
        const userConfirmed = window.confirm("Willst du wirklich die Firmenrolle löschen?")
        if (userConfirmed) {
            axios.delete(companytype.meta.location)
                .then((res) => {
                    setIsChanged(true)
                    setShow(false)
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    }

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>, companytype: DataWithMeta<Companytype>) => {
        e.preventDefault()
        setCompanytypeChange(companytype.data)
        setShow(true)
    }

    return listCompanytypes.map(element => {

        const handleSubmitEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            if (companytypeChange.name !== "") {
                axios
                    .put(
                        element.meta.location,
                        companytypeChange,
                        { 'headers': { 'location': element.meta.location, 'if-match': element.meta.etag } })
                    .then((res) => {
                        setIsChanged(true)
                        setShow(false)
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            }
        }

        return (
            <>
                <ListGroup.Item className="standardDesign lineWithButton" key={element.meta.location}>
                    <Col xs={6}>
                        <span>{element.data.name}</span>
                    </Col>
                    <Col xs={6}>
                        <ButtonGroup className="function-button standardDesign">
                            <Button className="standardDesign" variant="outline-dark" onClick={(e) => handleEdit(e, element)}><Pencil /></Button>
                            <Button className="standardDesign" variant="outline-dark" onClick={(e) => handleDelete(e, element)}><Trash /></Button>
                        </ButtonGroup>
                    </Col>
                    <Col xs={0}>
                        <InputCompanytypes
                            title="Firmenrolle ändern"
                            show={show} setShow={setShow}
                            handleSubmit={handleSubmitEdit}
                            companytype={companytypeChange} setCompanytype={setCompanytypeChange} />
                    </Col>
                </ListGroup.Item>
            </>
        )
    })
}

export default ListCompanytypes