import { DataWithMeta } from "components/forms.jsx"
import { Companytype } from "components/admin/companytypes/companytypes.jsx"

interface CompanytypesComponent {
    listCompanytypes: DataWithMeta<Companytype>[]
}

export const CompanytypesDropdown = ({ listCompanytypes }: CompanytypesComponent) => {
    const optionsdefault = [<option key="default" value=''>Rolle auswählen</option>]
    const options = listCompanytypes.map((role: DataWithMeta<Companytype>) => {
        return (
            <option key={role.meta.location} value={role.data.name} >{role.data.name}</option>
        )
    })
    return optionsdefault.concat(options)
}