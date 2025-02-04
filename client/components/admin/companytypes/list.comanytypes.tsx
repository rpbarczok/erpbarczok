import '../../../style.css'
import '../admin.css'
import { Companytype } from './companytypes.jsx'
import { DataWithMeta } from 'components/forms.jsx'
import { Button, ButtonGroup, Col, ListGroup, Row } from "react-bootstrap"
import { Pencil, Trash } from "react-bootstrap-icons"

interface ListCompanytypesInterface {
    listCompanytypes: DataWithMeta<Companytype>[]
    handleModal: Function
    handleDelete: Function
}

const ListCompanytypes = ({ listCompanytypes, handleModal, handleDelete }: ListCompanytypesInterface) => {

    return listCompanytypes.map(companytype => {

        return (
            <ListGroup.Item className="standardDesign lineWithButton" key={String(companytype.meta.location)}>
                <Row>
                <Col xs={6}>
                    <span>{companytype.data.name}</span>
                </Col>
                <Col xs={6}>
                    <ButtonGroup className="function-button standardDesign">
                        <Button className="standardDesign" variant="outline-dark" onClick={(e) => handleModal(e, companytype)}><Pencil /></Button>
                        <Button className="standardDesign" variant="outline-dark" onClick={(e) => handleDelete(e, companytype)}><Trash /></Button>
                    </ButtonGroup>
                </Col>
                </Row>
            </ListGroup.Item>
        )
    })
}

export default ListCompanytypes