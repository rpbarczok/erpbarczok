import { ChangeEvent, FunctionComponent } from 'react'
import { DataWithMeta } from '../../Pages.jsx'
import { Form } from 'react-bootstrap'
import { GenericResource, isResourceDescription, Resource, ResourceDescription } from '../resourceList.js'

export interface FieldDescription extends ResourceDescription<Resource> {
    name: 'Branche',
    paths: {
        all: '/fields/',
        single: '/fields/{id}'
    }
    empty: DataWithMeta<GenericResource>
}

export function isFieldDescription(obj: unknown): obj is FieldDescription {
    if (isResourceDescription(obj)){
        if (obj.name === 'Branche') return true
    } 
    return false
}

export interface FieldsPayloadAndDescription {
    description: FieldDescription
    item: DataWithMeta<GenericResource>
}

export const fieldDescription: FieldDescription = { name: 'Branche', paths: { 'all': '/fields/', 'single': '/fields/{id}' }, empty: { meta: { location: 0, etag: '' }, data: { name: '' } } }

interface FieldsInputProps {
    field: FieldsPayloadAndDescription
    setField: React.Dispatch<React.SetStateAction<FieldsPayloadAndDescription>>
}

export const FieldsInput: FunctionComponent<FieldsInputProps> = ({ field, setField }) => {

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setField({
            ...field,
            item: {
                ...field.item,
                data: {
                    ...field.item.data,
                    name: e.target.value
                }
            }
        })
    }

    return (
        <>
            <Form.Group controlId='formFirma'>
                <Form.Label className='labelPadding'>Branche</Form.Label>
                <Form.Control required type='text' value={field.item.data.name} onChange={handleChangeName} />
                <Form.Control.Feedback type='invalid'>
                    Bitte eine Branche eintragen.
                </Form.Control.Feedback>
            </Form.Group>
        </>
    )
}
