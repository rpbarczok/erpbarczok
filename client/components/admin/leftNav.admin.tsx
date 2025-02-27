import '../../style.css'
import './admin.css'
import {resourceList} from './resourceList.js'
import {Button, ButtonGroup} from 'react-bootstrap'
import { Resource } from './admin.js'

interface LeftNavigationInterface {
    setResource: React.Dispatch<React.SetStateAction<Resource>>
}

export const LeftNavigation = ({setResource}: LeftNavigationInterface) => {
    
    const resourceHandler = (e: React.MouseEvent<HTMLButtonElement>, resource: Resource) => {
        e.preventDefault()
        setResource(resource)
    }

    const ButtonList = resourceList.map(resource => {
        return (
            <Button id={resource.name} key={resource.name} onClick={(e) => resourceHandler (e, resource) }>
                {resource.name}
            </Button>
        )
    })

    const result = <ButtonGroup vertical>{ButtonList}</ButtonGroup>
    return result
}