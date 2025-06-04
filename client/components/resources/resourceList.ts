import { CompanyType } from './companyTypes/CompanyTypesInput.jsx'
import { DataWithMeta } from '../Pages.jsx'
import { Field } from './fields/Fields.jsx'
import { AddressType } from './addressTypes/AddressTypesInput.js'

export type ResourceType= CompanyType | Field | AddressType

export interface Resource {
    name: string
    paths: {
        all: '/company-types/' | '/fields/' | '/address-types/',
        single: '/company-types/{id}' | '/fields/{id}' | '/address-types/{id}'
    }
    empty: DataWithMeta<ResourceType>
}

export const resourceList: Resource[] = [{
    name: 'Beziehung',
    paths: { 'all': '/company-types/', 'single': '/company-types/{id}' },
    empty: {
        meta: { location: 0, etag: '' },
        data: { name: '' }
    }
},
{
    name: 'Branche',
    paths: { 'all': '/fields/', 'single': '/fields/{id}' },
    empty: {
        meta: { location: 0, etag: '' },
        data: { name: '' }
    }
},
{
    name: 'Adresstyp',
    paths: { 'all': '/address-types/', 'single': '/address-types/{id}' },
    empty: {
        meta: { location: 0, etag: '' },
        data: { name: '' }
    }
}
]
