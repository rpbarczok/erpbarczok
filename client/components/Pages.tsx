import { OpenPage } from './App.jsx'
import { CompanyPageBasis } from './companies/CompanyPageBasis.jsx'
import { ResourcesPageBasis } from './resources/ResourcesPageBasis.jsx'

export interface Meta {
    location: number
    etag: string
}

export interface DataWithMeta<T> {
    'meta': Meta
    'data': T
}

export const Pages = ({ activePage }: { activePage: OpenPage }) => {

    switch (activePage.id) {
        case 'stamm':
            return <CompanyPageBasis />
        case 'admin':
            return <ResourcesPageBasis />
        default:
            return <h1 className='flex-grow-1'> {activePage.name}: Work in Progress</h1>
    }
}