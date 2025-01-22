import { Row, Col, Button } from 'react-bootstrap'
import Heading from '../common/heading.js'
import ressourcelist from './ressourcelist.js'

const handleRessource = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const ressource = (e.target as HTMLButtonElement).id
}

const LinkeNavigation = () => {
    const result = ressourcelist.map(ressource => {
        return (
            <Button id={ressource.name} onClick={handleRessource}>
                ressource.name
            </Button>
        )
    })
    return result
}
export default function Admin() {
    return (
        <>
            <Row id="heading">
                <Heading title="Administratoren-Bereich" cssClass='adminForm' />
            </Row>
            <Row>
                <Col>
                    <LinkeNavigation />
                </Col>
                <Col>
                    Hauptteil
                </Col>
            </Row>
        </>
    )
}