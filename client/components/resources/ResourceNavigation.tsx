import { Button, ButtonGroup } from 'react-bootstrap'
import { Resource, ResourceDescription } from './resourceList.js'
import { FunctionComponent } from 'react'
import { companyTypeDescription } from './companyTypes/CompanyTypesInput.js'
import { fieldDescription } from './fields/Fields.js'
import { addressTypeDescription } from './addressTypes/AddressTypesInput.js'
import { countryDescription } from './countries/CountriesInput.js'

interface LeftNavigationProps {
    setActiveResource: React.Dispatch<React.SetStateAction<ResourceDescription<Resource>>>
    activeResource: ResourceDescription<Resource>
    setIsActiveResourceChanged: React.Dispatch<React.SetStateAction<boolean>>
}

export const ResourceNavigation: FunctionComponent<LeftNavigationProps> = ({ setActiveResource, activeResource, setIsActiveResourceChanged }) => {

const resourceDescriptionList = [
    companyTypeDescription,
    fieldDescription,
    addressTypeDescription,
    countryDescription
]


    const resourceHandler = (e: React.MouseEvent, resource: ResourceDescription<Resource>) => {
        e.preventDefault()
        setActiveResource(resource)
        setIsActiveResourceChanged(true)
    }

    const ButtonList = resourceDescriptionList.map(resource => {
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