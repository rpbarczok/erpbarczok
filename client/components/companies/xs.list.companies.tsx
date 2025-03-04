import { DataWithMeta } from "components/forms.jsx"
import { Company } from "./companies.jsx"
import { ListGroup } from "react-bootstrap"

interface XSListCompaniesComponent {
    filteredCompanies: DataWithMeta<Company>[]
}

export const XSListCompanies = ({ filteredCompanies }: XSListCompaniesComponent) => {

    const List = () => {
        if (filteredCompanies.length === 0) {
            return (
                <p>Keine Firmen gefunden!</p>
            )
        } else {
            return filteredCompanies.map((element) => {
                return (
                    <ListGroup.Item className="standardDesign" key={element.meta.location}>
                        {element.data.name + (element.data.abbr ? " (" + element.data.abbr + ")" : "")}
                    </ListGroup.Item>
                )
            }
            )
        }
    }

    return (
        <ListGroup className="scrollBox standardDesign d-sm-none" id="company-list">
            <List/>
        </ListGroup>)
}