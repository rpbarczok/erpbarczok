import { Companies } from './companies/companies.jsx'
import { Resources } from './resources/resources.jsx'
import { FormTab } from './navigation/ribbon.jsx'

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
            return <Companies />
        case 'resForm':
            return <Resources />
        default:
            return <h1 className='flex-grow-1'> {activeForm.name}: Work in Progress</h1>
    }
}