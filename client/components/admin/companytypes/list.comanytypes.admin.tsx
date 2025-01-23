import { Companytype } from "components/companies/companies.jsx"
import { Loc } from "app.jsx"
import { ListGroup } from "react-bootstrap"

interface ListCompanytypesInterface {
    listCompanytypes: Loc<Companytype>[]
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>
}

const ListCompanytypes = ({ listCompanytypes, setIsChanged }: ListCompanytypesInterface) => {
    const listgroupitems = listCompanytypes.map(element => {
        return (
            <ListGroup.Item className="smallDesign" key={element.location}>
                {element.data.name}
            </ListGroup.Item>
        )
    })
    const newItem = <ListGroup.Item className="smallDesign" key="newCompanytype">Neue Firmenrolle hinzufügen</ListGroup.Item>
    return (
        < ListGroup className="smallDesign" id="company-list" >
            {listgroupitems}
            {newItem}
        </ListGroup >
    )
}

export default ListCompanytypes