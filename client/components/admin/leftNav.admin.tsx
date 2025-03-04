import '../../style.css'
import './admin.css'
import { resourceList } from './resourceList.js'
import { Button, ButtonGroup } from 'react-bootstrap'
import { Resource } from './admin.js'

interface LeftNavigationInterface {
    setActiveResource: React.Dispatch<React.SetStateAction<Resource>>
    activeResource: Resource
}

export const LeftNavigation = ({ setActiveResource, activeResource }: LeftNavigationInterface) => {

    const resourceHandler = (e: React.MouseEvent<HTMLButtonElement>, resource: Resource) => {
        e.preventDefault()
        setActiveResource(resource)
    }

    const ButtonList = resourceList.map(resource => {
        return (
            <Button id={resource.name} key={resource.name} variant="outline-primary" onClick={(e) => resourceHandler(e, resource)} active={resource.name === activeResource.name}>
                {resource.name}
            </Button>
        )
    })

    return <>
        <ButtonGroup vertical className="d-none d-md-block">{ButtonList}</ButtonGroup>
        <ButtonGroup className="d-md-none">{ButtonList}</ButtonGroup>
    </>
}