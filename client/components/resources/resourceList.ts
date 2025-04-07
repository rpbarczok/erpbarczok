import { CompanyType } from './companyTypes/CompanyTypesInput.jsx'
import { DataWithMeta } from '../Pages.jsx'
import { Field } from './fields/Fields.jsx'

export interface Resource {
    name: string
    paths: {
        all: '/company-types/' | '/fields/',
        single: '/company-types/{id}' | '/fields/{id}'
    }
    empty: DataWithMeta<Field | CompanyType>
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
}
]
