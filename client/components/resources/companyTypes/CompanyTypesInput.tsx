import { ChangeEvent, FunctionComponent } from 'react'
import { DataWithMeta } from '../../Pages.jsx'
import { Form } from 'react-bootstrap'
import { Resource } from '../resourceList.js'


export interface CompanyType {
    'name': string
}

export const emptyCompanyTypeResource: Resource = { name: 'Beziehung', paths: { 'all': '/company-types/', 'single': '/company-types/{id}' }, empty: { meta: { location: 0, etag: '' }, data: { name: '' } } }

interface CompanyTypesInputProps {
    companyType: DataWithMeta<CompanyType>
    setCompanyType: React.Dispatch<React.SetStateAction<DataWithMeta<CompanyType>>>
}

export const CompanyTypesInput: FunctionComponent<CompanyTypesInputProps> = ({companyType, setCompanyType}) => {

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setCompanyType({
            meta: companyType.meta,
            data: { name: e.target.value }
        })
    }
    
    return <Form.Group controlId='formBeziehung'>
        <Form.Label className= 'labelPadding'>Beziehung</Form.Label>
        <Form.Control required type='text' value={companyType.data.name} onChange={handleChangeName} />
        <Form.Control.Feedback type='invalid'>
            Bitte eine Art der Beziehung zu einem Unternehmen eintragen.
        </Form.Control.Feedback>
    </Form.Group>
}
