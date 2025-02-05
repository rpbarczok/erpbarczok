import { ListGroup } from "react-bootstrap"
import ListCompanytypes from "./list.comanytypes.jsx"
import AddCompanytypes from "./add.companytypes.jsx"
import { Companytype } from "./companytypes.jsx"
import { DataWithMeta } from "components/forms.jsx"

interface TestComponent {
    listCompanytypes: DataWithMeta<Companytype>[]
    handleModal: Function,
    handleDelete: Function    
}
export const TestComponent = ({listCompanytypes, handleModal, handleDelete}: TestComponent) => {
    return (< ListGroup className="standardDesign" key="company-list" >
        <ListCompanytypes
            listCompanytypes={listCompanytypes}
            handleModal={handleModal}
            handleDelete={handleDelete} />
        <AddCompanytypes
            handleModal={handleModal} />
    </ListGroup >
    )
}