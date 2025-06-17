import { DataWithMeta } from '../Pages.jsx'
import { FunctionComponent } from 'react'
import { GenericResource } from 'components/resources/resourceList.js'

interface CompanyTypesProps {
    companyTypesList: DataWithMeta<GenericResource>[]
}

export const CompanyTypesDropdown: FunctionComponent<CompanyTypesProps> = ({ companyTypesList } ) => {
    const optionsDefault = [<option key='default' value=''>Rolle auswählen</option>]
    const options = companyTypesList.map((role: DataWithMeta<GenericResource>) => {
        return (
            <option key={role.meta.location} value={role.data.name} >{role.data.name}</option>
        )
    })
    return optionsDefault.concat(options)
}