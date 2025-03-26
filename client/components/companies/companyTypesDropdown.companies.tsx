import { DataWithMeta } from 'components/forms.jsx'
import { CompanyType } from 'components/resources/companyTypes/companyTypes.js'

interface CompanyTypesComponent {
    companyTypesList: DataWithMeta<CompanyType>[]
}

export const CompanyTypesDropdown = ({ companyTypesList }: CompanyTypesComponent) => {
    const optionsDefault = [<option key='default' value=''>Rolle auswählen</option>]
    const options = companyTypesList.map((role: DataWithMeta<CompanyType>) => {
        return (
            <option key={role.meta.location} value={role.data.name} >{role.data.name}</option>
        )
    })
    return optionsDefault.concat(options)
}