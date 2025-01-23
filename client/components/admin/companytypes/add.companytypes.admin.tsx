import { Button, ListGroup } from "react-bootstrap"
import { Plus } from "react-bootstrap-icons"
import { useState, MouseEvent } from "react"
import { Companytype } from "components/companies/companies.jsx"
import axios from 'axios'
import InputCompanytypes from "./input.companytypes.admin.jsx"

interface AddCompanytypesInterface {
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>
}

const AddCompanytypes = ({ setIsChanged }: AddCompanytypesInterface) => {
    const [show, setShow] = useState<boolean>(false) // to handle the modal
    const [companytype, setCompanytype] = useState<Companytype>({ name: "" })

    const handleSubmitNew = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (companytype.name !== "") {
            axios
                .post(`/companytypes/`, companytype)
                .then((res) => {
                    setIsChanged(true)
                    setCompanytype({
                        name: ""
                    })
                    setShow(false)
                })
        }
    }

    return <>
        <ListGroup.Item className="standardDesign lineWithButton" key="newCompanytype">
            <span>Neue Firmenrolle hinzufügen</span>
            <Button className="standardDesign" variant="outline-dark" onClick={() => setShow(true)}><Plus /></Button>
        </ListGroup.Item>
        <InputCompanytypes show={show} setShow={setShow}
            handleSubmit={handleSubmitNew}
            companytype={companytype} setCompanytype={setCompanytype} />
    </>
}

export default AddCompanytypes