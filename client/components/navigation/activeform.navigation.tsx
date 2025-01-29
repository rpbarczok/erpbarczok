import Companies from "../companies/companies.jsx"
import Admin from "../admin/admin.jsx"
import { FormTab } from "./forms.js"
import '../../style.css'
import './navigation.css'

const ActiveForm = ({activeForm}: {activeForm: FormTab}) => {
    switch (activeForm.id) {
        case 'stammForm':
            return <Companies />
        case 'adminForm':
            return <Admin />
        default:
            return <h1> {activeForm.name}: Work in Progress</h1>
    }
}

export default ActiveForm