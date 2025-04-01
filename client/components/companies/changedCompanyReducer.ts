import { DataWithMeta } from '../forms.js'
import { Company } from './CompanyFormBasis.jsx'

export interface ChangedCompanyAction {
    type: 'nameChange' | 'abbrChange' | 'wwwChange' | 'companyTypeChange' | 'companyChange'
    newValue: string | DataWithMeta<Company>
}

export function changedCompanyReducer(changedCompany: DataWithMeta<Company>, action: ChangedCompanyAction): DataWithMeta<Company> {
    if (typeof action.newValue === 'string') {
        switch (action.type) {
            case 'nameChange': {
                return {
                    meta: changedCompany.meta,
                    data: {
                        ...changedCompany.data,
                        'name': action.newValue,
                    }
                }
            }
            case 'abbrChange': {
                return (
                    {
                        meta: changedCompany.meta,
                        data: {
                            ...changedCompany.data,
                            'abbr': action.newValue,
                        }
                    })
            }
            case 'wwwChange': {
                return (
                    {
                        meta: changedCompany.meta,
                        data: {
                            ...changedCompany.data,
                            'www': action.newValue,
                        }
                    })
            }
            case 'companyTypeChange': {
                return ({
                    meta: changedCompany.meta,
                    data: {
                        ...changedCompany.data,
                        'companyType': action.newValue,
                    }
                })
            }
            default: {
                throw Error('Unknown action: ' + action.type)
            }
        }
    } else {
        if (action.type === 'companyChange') {
            return action.newValue
        }
    }
    throw new Error('Unknown action: ' + action.type)
}