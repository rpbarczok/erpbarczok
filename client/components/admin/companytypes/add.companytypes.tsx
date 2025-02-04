import '../../../style.css'
import '../admin.css'
import { Button, ListGroup, Row, Col } from "react-bootstrap"
import { Plus } from "react-bootstrap-icons"

interface AddCompanytypesInterface {
    handleModal: Function
}

const AddCompanytypes = ({ handleModal }: AddCompanytypesInterface) => {

    return <>
        <ListGroup.Item className="standardDesign lineWithButton" key="newCompanytype">
            <Row>
                <Col>
                    <span>Neue Firmenrolle hinzufügen</span>
                </Col>
                <Col>
                    <Button className="standardDesign function-button" variant="outline-dark" onClick={(e) => handleModal(e, undefined)}><Plus /></Button>
                </Col>
            </Row>
        </ListGroup.Item>
    </>
}

export default AddCompanytypes