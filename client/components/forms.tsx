import { CompanyFormBasis } from './companies/CompanyFormBasis.jsx'
import { FormTab } from './navigation/ribbon.jsx'
import { ResourcesFormBasis } from './resources/ResourcesFormBasis.jsx'

interface Meta {
    location: number
    etag: string
}

export interface DataWithMeta<T> {
    'meta': Meta
    'data': T
}

export const Forms = ({ activeForm }: { activeForm: FormTab }) => {

    switch (activeForm.id) {
        case 'stammForm':
            return <CompanyFormBasis />
        case 'resForm':
            return <ResourcesFormBasis />
        default:
            return <h1 className='flex-grow-1'> {activeForm.name}: Work in Progress</h1>
    }
}