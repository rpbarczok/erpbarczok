import { DataWithMeta } from "components/Pages.js"
import { ResourceDescriptionType, ResourceType } from "./resourceList.js"
import { Field, FieldsInput } from "./fields/Fields.js"
import { CompanyType, CompanyTypesInput } from "./companyTypes/CompanyTypesInput.js"
import { FunctionComponent, SetStateAction } from "react"
import { AddressType, AddressTypesInput } from "./addressTypes/AddressTypesInput.js"
import { CountriesInput, Country } from "./countries/CountriesInput.js"

interface ActiveResourceProps {
    resource: ResourceDescriptionType
    item: DataWithMeta<ResourceType>
    setItem: React.Dispatch<SetStateAction<DataWithMeta<ResourceType>>>
}

export const ActiveResource: FunctionComponent<ActiveResourceProps> = ({ resource, item, setItem }) => {
    switch (resource.name) {
        case 'Beziehung':
            return <CompanyTypesInput
                companyType={item as DataWithMeta<CompanyType>}
                setCompanyType={setItem as React.Dispatch<SetStateAction<DataWithMeta<CompanyType>>>}
            />
        case 'Branche':
            return <FieldsInput
                field={item as DataWithMeta<Field>}
                setField={setItem as React.Dispatch<SetStateAction<DataWithMeta<Field>>>} />
        case 'Adresstyp':
            return <AddressTypesInput
                addressType={item as DataWithMeta<AddressType>}
                setAddressType={setItem as React.Dispatch<SetStateAction<DataWithMeta<AddressType>>>} />
        case 'Land':
            return <CountriesInput
                country={item as DataWithMeta<Country>}
                setCountry={setItem as React.Dispatch<SetStateAction<DataWithMeta<Country>>>}
            />
        default:
            <p>No Content</p>
    }

}