import { useReducer } from 'react'
import { DataWithMeta } from '../Pages.jsx'
import { CompanyPageExtended } from './CompanyPageExtended.jsx'
import { changedCompanyReducer } from './utils/changedCompanyReducer.js'
import { useCompanies } from './utils/useCompanies.js'
import { useResources } from 'components/resources/useResources.js'
import { Resource } from 'components/resources/resourceList.js'

export interface Company {
    'name': string
    'companyType': string
    'abbr'?: string
    'www'?: string
}

export const emptyCompany: DataWithMeta<Company> = { 'meta': { 'location': 0, 'etag': '' }, 'data': { 'name': '', 'companyType': 'default', 'abbr': '', 'www': '' } }

export const CompanyPageBasis = () => {
    const companyTypeResource: Resource = {name: 'Beziehung',paths: { 'all': '/company-types/', 'single': '/company-types/{id}' },empty: {meta: { location: 0, etag: '' },data: { name: '' }}}
    const [companyTypesList] = useResources(companyTypeResource)
    const [changedCompany, changedCompanyDispatch] = useReducer(changedCompanyReducer, emptyCompany)
    const [companiesList, setIsCompanyChanged] = useCompanies()
    
    return(
        <CompanyPageExtended
            companiesList = { companiesList }
            companyTypesList = { companyTypesList }
            setIsCompanyChanged = { setIsCompanyChanged }
            changedCompany = { changedCompany }
            changedCompanyDispatch = { changedCompanyDispatch }
                />
    )
    }
