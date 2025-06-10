import { CompanyType, companyTypeDescription } from './companyTypes/CompanyTypesInput.jsx'
import { DataWithMeta } from '../Pages.jsx'
import { Field, fieldDescription} from './fields/Fields.jsx'
import { AddressType, addressTypeDescription } from './addressTypes/AddressTypesInput.js'
import { Country, countryDescription } from './countries/CountriesInput.js'

interface PathsResource {
    'all': '/company-types/' | '/address-types/' | '/fields/' | '/countries/'
    'single': '/company-types/{id}' | '/address-types/{id}' | '/fields/{id}' | '/countries/{id}'
}

export type ResourceType = CompanyType | AddressType | Field | Country

export interface ResourceDescription<T> {
    name: string
    paths: PathsResource
    empty: DataWithMeta<T>
}

export type ResourceDescriptionType = ResourceDescription<CompanyType>  | ResourceDescription<AddressType> | ResourceDescription<Field> | ResourceDescription<Country>

export const resourceDescriptionList: ResourceDescriptionType[] = [
    companyTypeDescription,
    fieldDescription,
    addressTypeDescription,
    countryDescription
]
