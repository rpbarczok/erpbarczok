import {Col, Row, Button} from 'react-bootstrap'
import "../../style.css"

export default function HeadingCompanies() {
    return (
        <Row className="heading stammdaten">
            <Col>
                <h5>Stammdaten Kunden, Lieferanten, Partner, Mitarbeiter</h5>
            </Col>
            <Col>
                <Button className="function-button" variant="outline-primary" size="sm">Schließen</Button>
            </Col>
        </Row>
    )
} 