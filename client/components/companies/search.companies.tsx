import '../../style.css'
import './companies.css'
import React, { ChangeEvent } from "react"
import { Form, Row, InputGroup } from 'react-bootstrap'
import { Search } from 'react-bootstrap-icons'

interface SearchCompaniesInterface {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
}

export function SearchCompanies({ search, setSearch }: SearchCompaniesInterface) {

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    return (
        <>
            <Row className="d-none d-sm-block">
                <Form>
                    <Form.Label className="standardDesign">Suche (Firmenname, Kürzel)</Form.Label>
                    <Form.Control type="text" className="standardDesign" value={search} onChange={handleSearch} />
                </Form>
            </Row>
            <Row className="d-block d-sm-none">
                <InputGroup >
                    <InputGroup.Text><Search /></InputGroup.Text>
                    <Form.Control type="text" className="standardDesign" value={search} onChange={handleSearch} placeholder='Suche (Firmenname, Kürzel)' />
                </InputGroup>
            </Row>
        </>
    )
}
