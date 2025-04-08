import { Company } from './CompanyPageBasis.jsx'
import { DataWithMeta } from '../Pages.jsx'
import { ListGroup } from 'react-bootstrap'


interface CompaniesSMListInterface {
    filteredCompanies: DataWithMeta<Company>[]
    activeCompany: DataWithMeta<Company>
    changeActive: (active: number) => void
}

export const CompaniesSMList = ({ filteredCompanies, activeCompany, changeActive }: CompaniesSMListInterface) => {

    const List = () => {
        if (filteredCompanies.length === 0) {
            return (
                <p>Keine Unternehmen gefunden!</p>
            )
        } else {
            return filteredCompanies.map((element) => {
                return (
                    <ListGroup.Item  key={element.meta.location} active={element.meta.location === activeCompany.meta.location} onClick={() => changeActive(element.meta.location)} >
                        {element.data.name + (element.data.abbr ? ' (' + element.data.abbr + ')' : '')}
                    </ListGroup.Item>
                )

            }
            )
        }
    }

    return (
        <ListGroup className='scrollBox d-none d-sm-block' style={{ marginTop: '10px' }} id='company-list' >
            <List />
        </ListGroup >)
}