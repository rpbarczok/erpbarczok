import '../../../style.css'
import '../admin.css'
import { Button, ListGroup } from "react-bootstrap"
import { Plus } from "react-bootstrap-icons"

interface AddCompanytypesInterface {
    handleModal: Function
}

const AddCompanytypes = ({ handleModal }: AddCompanytypesInterface) => {

    return <>
        <ListGroup.Item className="standardDesign lineWithButton" key="newCompanytype">
            <span>Neue Firmenrolle hinzufügen</span>
            <Button className="standardDesign" variant="outline-dark" onClick={(e) => handleModal(e, undefined)}><Plus /></Button>
        </ListGroup.Item>
    </>
}

export default AddCompanytypes