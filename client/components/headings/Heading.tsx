import {Col, Row} from 'react-bootstrap'
import { ThemeContext } from '../../utils/themeContext.js'
import { FunctionComponent, useContext } from 'react'


interface HeadingProps {
    title: string
    cssClass: string
}

export const Heading: FunctionComponent<HeadingProps> = ({title, cssClass }) => {

    const theme = useContext(ThemeContext)
    
    return (
        <Row className={'heading ' + cssClass + '-' + theme }>
            <Col>
                <h5>{title}</h5>
            </Col>
        </Row>
    )
}