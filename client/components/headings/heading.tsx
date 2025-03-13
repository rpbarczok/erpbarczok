import {Col, Row} from 'react-bootstrap'
import './heading.css'
import '../../style.css'
import { useContext } from 'react'
import { ThemeContext } from '../../utils/themeContext.js'

interface HeadingInterface {
    title: string
    cssClass: string
}

export function Heading({title, cssClass }: HeadingInterface) {

    const theme = useContext(ThemeContext)
    return (
        <Row className={"heading " + cssClass + "-" + theme }>
            <Col>
                <h5>{title}</h5>
            </Col>
        </Row>
    )
}