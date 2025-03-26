import { DataWithMeta } from 'components/forms.jsx'
import { Company } from './companies.jsx'
import { ListGroup } from 'react-bootstrap'


interface SMListCompaniesComponent {
    filteredCompanies: DataWithMeta<Company>[]
    activeCompany: DataWithMeta<Company>
    handleChangeActive: (active: number) => void
}

export const SMListCompanies = ({ filteredCompanies, activeCompany, handleChangeActive }: SMListCompaniesComponent) => {

    const List = () => {
        if (filteredCompanies.length === 0) {
            return (
                <p>Keine Unternehmen gefunden!</p>
            )
        } else {
            return filteredCompanies.map((element) => {
                return (
                    <ListGroup.Item className='standardDesign' key={element.meta.location} active={element.meta.location === activeCompany.meta.location} onClick={() => handleChangeActive(element.meta.location)} >
                        {element.data.name + (element.data.abbr ? ' (' + element.data.abbr + ')' : '')}
                    </ListGroup.Item>
                )

            }
            )
        }
    }

    return (
        <ListGroup className='scrollBox standardDesign d-none d-sm-block' style={{ marginTop: '10px'}} id = 'company-list' >
    <List />
        </ListGroup >)
}