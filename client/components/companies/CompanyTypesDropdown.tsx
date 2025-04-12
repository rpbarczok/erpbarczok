import { CompanyType } from '../resources/companyTypes/CompanyTypesInput.jsx'
import { DataWithMeta } from '../Pages.jsx'

interface CompanyTypesInterface {
    companyTypesList: DataWithMeta<CompanyType>[]
}

export const CompanyTypesDropdown = ({ companyTypesList }: CompanyTypesInterface) => {
    const optionsDefault = [<option key='default' value=''>Rolle auswählen</option>]
    const options = companyTypesList.map((role: DataWithMeta<CompanyType>) => {
        return (
            <option key={role.meta.location} value={role.data.name} >{role.data.name}</option>
        )
    })
    return optionsDefault.concat(options)
}