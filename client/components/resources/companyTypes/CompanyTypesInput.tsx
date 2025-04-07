import { ChangeEvent } from 'react'
import { DataWithMeta } from '../../Pages.jsx'
import { Form } from 'react-bootstrap'


export interface CompanyType {
    'name': string
}

interface CompanyTypesInputInterface {
    companyType: DataWithMeta<CompanyType>
    setCompanyType: React.Dispatch<React.SetStateAction<DataWithMeta<CompanyType>>>
}

export const CompanyTypesInput = ({companyType, setCompanyType}: CompanyTypesInputInterface) => {

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCompanyType({
            meta: companyType.meta,
            data: { name: e.target.value }
        })
    }
    
    return <Form.Group controlId='formBeziehung'>
        <Form.Label>Beziehung</Form.Label>
        <Form.Control required type='text' value={companyType.data.name} onChange={handleChangeName} />
        <Form.Control.Feedback type='invalid'>
            Bitte eine Art der Beziehung zu einem Unternehmen eintragen.
        </Form.Control.Feedback>
    </Form.Group>
}
