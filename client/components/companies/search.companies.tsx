import '../../style.css'
import './companies.css'
import React, { ChangeEvent } from "react"
import { Form } from 'react-bootstrap'

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
            <Form className="d-none d-sm-block">
                <Form.Label className="standardDesign">Suche (Firmenname, Kürzel)</Form.Label>
                <Form.Control type="text" className="standardDesign" value={search} onChange={handleSearch} />
            </Form>
            <Form className="d-block d-sm-none">
                <Form.Control type="text" className="standardDesign" value={search} onChange={handleSearch} placeholder='Suche (Firmenname, Kürzel)' />
            </Form>
        </>
    )
}
