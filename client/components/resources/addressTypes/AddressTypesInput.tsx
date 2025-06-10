import { ChangeEvent, FunctionComponent } from 'react'
import { DataWithMeta } from '../../Pages.jsx'
import { Form } from 'react-bootstrap'
import { ResourceDescription } from '../resourceList.js'


export interface AddressType {
    'name': string
}

export const addressTypeDescription: ResourceDescription<AddressType> = { name: 'Adresstyp', paths: { 'all': '/address-types/', 'single': '/address-types/{id}' }, empty: { meta: { location: 0, etag: '' }, data: { name: '' } } }

interface AddressTypesInputProps {
    addressType: DataWithMeta<AddressType>
    setAddressType: React.Dispatch<React.SetStateAction<DataWithMeta<AddressType>>>
}

export const AddressTypesInput: FunctionComponent<AddressTypesInputProps> = ({addressType, setAddressType}) => {

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setAddressType({
            meta: addressType.meta,
            data: { name: e.target.value }
        })
    }
    
    return <Form.Group controlId='formBeziehung'>
        <Form.Label className= 'labelPadding'>Beziehung</Form.Label>
        <Form.Control required type='text' value={addressType.data.name} onChange={handleChangeName} />
        <Form.Control.Feedback type='invalid'>
            Bitte eine Art der Beziehung zu einem Unternehmen eintragen.
        </Form.Control.Feedback>
    </Form.Group>
}
