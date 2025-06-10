import { ChangeEvent, FunctionComponent } from 'react'
import { DataWithMeta } from '../../Pages.jsx'
import { Form } from 'react-bootstrap'
import { ResourceDescription } from '../resourceList.js'

export interface Field {
    'name': string
}

interface FieldsInputProps {
    field: DataWithMeta<Field>
    setField: React.Dispatch<React.SetStateAction<DataWithMeta<Field>>>
}

export const fieldDescription: ResourceDescription<Field> = { name: 'Branche', paths: { 'all': '/fields/', 'single': '/fields/{id}' }, empty: { meta: { location: 0, etag: '' }, data: { name: '' } } }

export const FieldsInput: FunctionComponent<FieldsInputProps> = ({ field, setField }) => {

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setField({
            meta: field.meta,
            data: { name: e.target.value }
        })
    }

    return (
        <>
            <Form.Group controlId='formFirma'>
                <Form.Label className='labelPadding'>Branche</Form.Label>
                <Form.Control required type='text' value={field.data.name} onChange={handleChangeName} />
                <Form.Control.Feedback type='invalid'>
                    Bitte eine Branche eintragen.
                </Form.Control.Feedback>
            </Form.Group>
        </>
    )
}
