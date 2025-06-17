import { ChangeEvent, FunctionComponent } from 'react'
import { DataWithMeta } from '../../Pages.jsx'
import { Form } from 'react-bootstrap'
import { GenericResource, isResourceDescription, Resource, ResourceDescription} from '../resourceList.js'


export interface AddressTypeDescription extends ResourceDescription<Resource> {
    name: 'Adresstyp',
    paths: {
        all: '/address-types/',
        single: '/address-types/{id}'
    }
    empty: DataWithMeta<GenericResource>
}

export function isAddressTypeDescription(obj: unknown): obj is AddressTypeDescription {
    if (isResourceDescription(obj)){
        if (obj.name === 'Adresstyp') return true
    } 
    return false
}


export interface AddressTypePayloadAndDescription {
    description: AddressTypeDescription
    item: DataWithMeta<GenericResource>
}

export const addressTypeDescription: AddressTypeDescription = { name: 'Adresstyp', paths: { 'all': '/address-types/', 'single': '/address-types/{id}' }, empty: { meta: { location: 0, etag: '' }, data: { name: '' } } }

interface AddressTypesInputProps {
    addressType: AddressTypePayloadAndDescription
    setAddressType: React.Dispatch<React.SetStateAction<AddressTypePayloadAndDescription>>
}

export const AddressTypesInput: FunctionComponent<AddressTypesInputProps> = ({addressType, setAddressType}) => {

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setAddressType({
            ...addressType,
            item: {
                ...addressType.item,
                data: { name: e.target.value }
            }
        })
    }
    
    return <Form.Group controlId='formBeziehung'>
        <Form.Label className= 'labelPadding'>Beziehung</Form.Label>
        <Form.Control required type='text' value={addressType.item.data.name} onChange={handleChangeName} />
        <Form.Control.Feedback type='invalid'>
            Bitte eine Art der Beziehung zu einem Unternehmen eintragen.
        </Form.Control.Feedback>
    </Form.Group>
}
