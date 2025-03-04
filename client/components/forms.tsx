import { Companies } from "./companies/companies.jsx"
import { Admin } from "./admin/admin.jsx"
import { FormTab } from "./navigation/ribbon.js"
import '../style.css'

interface Meta {
    location: number
    etag: string
}

export interface DataWithMeta<T> {
    "meta": Meta
    "data": T
}

export const Forms = ({ activeForm }: { activeForm: FormTab }) => {
    
    switch (activeForm.id) {
        case 'stammForm':
            return <Companies />
        case 'adminForm':
            return <Admin />
        default:
            return <h1 className="flex-grow-1"> {activeForm.name}: Work in Progress</h1>
    }
}