import {Col, Row} from 'react-bootstrap'
import { ThemeContext } from '../../utils/themeContext.js'
import { useContext } from 'react'


interface HeadingInterface {
    title: string
    cssClass: string
}

export function Heading({title, cssClass }: HeadingInterface) {

    const theme = useContext(ThemeContext)
    
    return (
        <Row className={'heading ' + cssClass + '-' + theme }>
            <Col>
                <h5>{title}</h5>
            </Col>
        </Row>
    )
}