import { Button, ButtonGroup } from 'react-bootstrap'
import { Resource, resourceList } from './resourceList.js'

interface LeftNavigationInterface {
    setActiveResource: React.Dispatch<React.SetStateAction<Resource>>
    activeResource: Resource
    setIsResourceChanged: React.Dispatch<React.SetStateAction<boolean>>
}

export const ResourceNavigation = ({ setActiveResource, activeResource, setIsResourceChanged }: LeftNavigationInterface) => {

    const resourceHandler = (e: React.MouseEvent, resource: Resource) => {
        e.preventDefault()
        setActiveResource(resource)
        setIsResourceChanged(true)
    }

    const ButtonList = resourceList.map(resource => {
        return (
            <Button className='link' id={resource.name} variant='outline-secondary' key={resource.name} onClick={(e) => resourceHandler(e, resource)} active={resource.name === activeResource.name}>
                {resource.name}
            </Button>
        )
    })

    return <>
        <ButtonGroup vertical className='d-none d-md-block' >{ButtonList}</ButtonGroup>
        <ButtonGroup className='d-md-none'>{ButtonList}</ButtonGroup>
    </>
}