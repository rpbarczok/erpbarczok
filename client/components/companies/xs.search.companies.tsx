import { Form, InputGroup } from 'react-bootstrap'
import '../../style.css'
import './companies.css'
import { ChangeEvent } from 'react'
import { Search } from 'react-bootstrap-icons'

interface XSSearchCompaniesInterface {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
}

export function XSSearchCompanies({ search, setSearch }: XSSearchCompaniesInterface) {

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    return (
        <>
            <InputGroup style={{ padding: '10px 0 0 0' }} >
                <InputGroup.Text><Search /></InputGroup.Text>
                <Form.Control type="text" className="standardDesign" value={search} onChange={handleSearch} placeholder='Suche (Firmenname, Kürzel)' />
            </InputGroup>
        </>
    )
}
