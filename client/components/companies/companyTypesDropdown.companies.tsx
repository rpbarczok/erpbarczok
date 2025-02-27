import { DataWithMeta } from "components/forms.jsx"
import { CompanyType } from "components/admin/companyTypes/companyTypes.jsx"

interface CompanyTypesComponent {
    listCompanyTypes: DataWithMeta<CompanyType>[]
}

export const CompanyTypesDropdown = ({ listCompanyTypes }: CompanyTypesComponent) => {
    const optionsdefault = [<option key="default" value=''>Rolle auswählen</option>]
    const options = listCompanyTypes.map((role: DataWithMeta<CompanyType>) => {
        return (
            <option key={role.meta.location} value={role.data.name} >{role.data.name}</option>
        )
    })
    return optionsdefault.concat(options)
}