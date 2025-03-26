import { DataWithMeta } from '../../forms.js'
import { Form } from 'react-bootstrap'
import React, { ChangeEvent } from 'react'

export interface Field {
    'name': string
}

interface InputFieldComponent {
    field: DataWithMeta<Field>
    setField: React.Dispatch<React.SetStateAction<DataWithMeta<Field>>>
}
export const InputFields = ({ field, setField }: InputFieldComponent) => {
    
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
                <Form.Label>Branche</Form.Label>
                <Form.Control required type='text' value={field.data.name} onChange={handleChangeName} />
                <Form.Control.Feedback type='invalid'>
                    Bitte eine Branche eintragen.
                </Form.Control.Feedback>
            </Form.Group>
        </>
    )
}
