import '../../style.css'
import './admin.css'
import { resourceList } from './resourceList.js'
import { Button, ButtonGroup, ListGroup } from 'react-bootstrap'
import { Resource } from './admin.js'

interface LeftNavigationInterface {
    setActiveResource: React.Dispatch<React.SetStateAction<Resource>>
    activeResource: Resource
}

export const LeftNavigation = ({ setActiveResource, activeResource }: LeftNavigationInterface) => {

    const resourceHandler = (resource: Resource) => {
        setActiveResource(resource)
    }

    const ButtonList = resourceList.map(resource => {
        return (
            <Button className="link" id={resource.name} variant="outline-secondary" key={resource.name} onClick={() => resourceHandler(resource)} active={resource.name === activeResource.name}>
                {resource.name}
            </Button>
        )
    })

    return <>
        <ButtonGroup vertical className="d-none d-md-block" >{ButtonList}</ButtonGroup>
        <ButtonGroup className="d-md-none">{ButtonList}</ButtonGroup>
    </>
}