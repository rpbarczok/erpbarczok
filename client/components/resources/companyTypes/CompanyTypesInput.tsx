import { ChangeEvent, FunctionComponent } from 'react'
import { DataWithMeta } from '../../Pages.jsx'
import { Form } from 'react-bootstrap'
import { GenericResource, isResourceDescription, Resource, ResourceDescription } from '../resourceList.js'

// companyType

export interface CompanyTypeDescription extends ResourceDescription<Resource> {
    name: 'Beziehung',
    paths: {
        all: '/company-types/',
        single: '/company-types/{id}'
    }
    empty: DataWithMeta<GenericResource>
}

export function isCompanyTypeDescription(obj: unknown): obj is CompanyTypeDescription {
    if (isResourceDescription(obj)){
        if (obj.name === 'Beziehung') return true
    } 
    return false
}

export interface CompanyTypePayloadAndDescription {
    description: CompanyTypeDescription
    item: DataWithMeta<GenericResource>
}

interface CompanyTypesInputProps {
    companyType: CompanyTypePayloadAndDescription
    setCompanyType: React.Dispatch<React.SetStateAction<CompanyTypePayloadAndDescription>>
}

export const companyTypeDescription: CompanyTypeDescription = { name: 'Beziehung', paths: { 'all': '/company-types/', 'single': '/company-types/{id}' }, empty: { meta: { location: 0, etag: '' }, data: { name: '' } } }

export const CompanyTypesInput: FunctionComponent<CompanyTypesInputProps> = ({ companyType, setCompanyType }) => {

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCompanyType({
            ...companyType,
            item: {
                ...companyType.item,
                data: { name: e.target.value }
            }
        })
    }

    return <Form.Group controlId='formBeziehung'>
        <Form.Label className='labelPadding'>Beziehung</Form.Label>
        <Form.Control required type='text' value={companyType.item.data.name} onChange={handleChangeName} />
        <Form.Control.Feedback type='invalid'>
            Bitte eine Art der Beziehung zu einem Unternehmen eintragen.
        </Form.Control.Feedback>
    </Form.Group>
}
