import '../../style.css'
import './resources.css'
import { Field } from './fields/fields.js'
import { CompanyType } from './companyTypes/companyTypes.js'
import { DataWithMeta } from 'components/forms.js'

export interface Resource {
    name: string
    paths: {
        all: '/company-types/' | '/fields/',
        single: '/company-types/{id}' | '/fields/{id}'
    }
    empty: DataWithMeta<Field | CompanyType>
}

export const resourceList: Resource[] = [{
    name: "Beziehung",
    paths: { "all": "/company-types/", "single": "/company-types/{id}" },
    empty: {
        meta: { location: 0, etag: '' },
        data: { name: '' }
    }
},
{
    name: "Branche",
    paths: { "all": "/fields/", "single": "/fields/{id}" },
    empty: {
        meta: { location: 0, etag: '' },
        data: { name: '' }
    }
}
]
