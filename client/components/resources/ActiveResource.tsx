import { DataWithMeta } from "components/Pages.js"
import { Resource, ResourceType } from "./resourceList.js"
import { FieldsInput } from "./fields/Fields.js"
import { CompanyTypesInput } from "./companyTypes/CompanyTypesInput.js"
import { FunctionComponent, SetStateAction } from "react"
import { AddressTypesInput } from "./addressTypes/AddressTypesInput.js"

interface ActiveResourceProps {
    resource: Resource
    newItem: DataWithMeta<ResourceType>
    setNewItem: React.Dispatch<SetStateAction<DataWithMeta<ResourceType>>>
}

export const ActiveResource: FunctionComponent<ActiveResourceProps> = ({ resource, newItem, setNewItem }) => {
    switch (resource.name) {
        case 'Beziehung':
            return <CompanyTypesInput
                companyType={newItem}
                setCompanyType={setNewItem}
            />
        case 'Branche':
            return <FieldsInput
                field={newItem}
                setField={setNewItem} />
        case 'Adresstyp':
            return <AddressTypesInput
                addressType={newItem}
                setAddressType={setNewItem} />
        default:
            <p>No Content</p>
    }

}