import { CompanyPageBasis } from './companies/CompanyPageBasis.js'
import { PageTab } from './navigation_alt/ribbon.js'
import { ResourcesPageBasis } from './resources/ResourcesPageBasis.jsx'

interface Meta {
    location: number
    etag: string
}

export interface DataWithMeta<T> {
    'meta': Meta
    'data': T
}

export const Pages = ({ activePage }: { activePage: PageTab }) => {

    switch (activePage.id) {
        case 'stamm':
            return <CompanyPageBasis />
        case 'admin':
            return <ResourcesPageBasis />
        default:
            return <h1 className='flex-grow-1'> {activePage.name}: Work in Progress</h1>
    }
}