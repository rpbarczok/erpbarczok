import { DataWithMeta } from "components/Pages.js"
import { Resource, ResourceCollection } from "./resourceList.js"
import { FieldsInput } from "./fields/Fields.js"
import { CompanyTypesInput } from "./companyTypes/CompanyTypesInput.js"
import { FunctionComponent, SetStateAction } from "react"

interface ActiveResourceProps {
    resource: Resource
    newItem: DataWithMeta<ResourceCollection>
    setNewItem: React.Dispatch<SetStateAction<DataWithMeta<ResourceCollection>>>
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
        default:
            <p>No Content</p>
    }

}