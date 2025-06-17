import { Resource, ResourcePayloadAndDescription } from "./resourceList.js"
import { FieldsInput, FieldsPayloadAndDescription } from "./fields/Fields.js"
import { CompanyTypePayloadAndDescription, CompanyTypesInput } from "./companyTypes/CompanyTypesInput.js"
import { FunctionComponent, SetStateAction } from "react"
import { AddressTypePayloadAndDescription, AddressTypesInput } from "./addressTypes/AddressTypesInput.js"
import { CountriesInput, CountryPayloadAndDescription } from "./countries/CountriesInput.js"

interface ActiveResourceProps {
    item: ResourcePayloadAndDescription<Resource>
    setItem: React.Dispatch<SetStateAction<ResourcePayloadAndDescription<Resource>>>
}

export const ActiveResource: FunctionComponent<ActiveResourceProps> = ({ item, setItem }) => {
    switch (item.description.name) {
        case 'Beziehung':
            return <CompanyTypesInput
                companyType={item as CompanyTypePayloadAndDescription}
                setCompanyType={setItem as React.Dispatch<SetStateAction<CompanyTypePayloadAndDescription>>}
            />
        case 'Branche':
            return <FieldsInput
                field={item as FieldsPayloadAndDescription}
                setField={setItem as React.Dispatch<SetStateAction<FieldsPayloadAndDescription>>} />
        case 'Adresstyp':
            return <AddressTypesInput
                addressType={item as AddressTypePayloadAndDescription}
                setAddressType={setItem as React.Dispatch<SetStateAction<AddressTypePayloadAndDescription>>} />
        case 'Land':
            return <CountriesInput
                country={item as CountryPayloadAndDescription}
                setCountry={setItem as React.Dispatch<SetStateAction<CountryPayloadAndDescription>>}
            />
        default:
            <p>No Content</p>
    }

}