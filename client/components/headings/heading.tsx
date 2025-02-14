import {Col, Row} from 'react-bootstrap'
import './heading.css'
import '../../style.css'

interface HeadingInterface {
    title: string
    cssClass: string
}

export function Heading({title, cssClass }: HeadingInterface) {
    return (
        <Row className={"heading " + cssClass }>
            <Col>
                <h5>{title}</h5>
            </Col>
        </Row>
    )
}