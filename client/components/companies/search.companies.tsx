import React, { ChangeEvent } from "react"
import "../../style.css"
import {Form} from 'react-bootstrap'

interface SearchCompaniesInterface {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
}

export default function SearchCompanies({search, setSearch}: SearchCompaniesInterface) {

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    return (
        <Form >
            <Form.Label className="standardDesign">Suche (Firmenname, Kürzel)</Form.Label>
            <Form.Control type="text" className="standardDesign" value={search} onChange={handleSearch} />
        </Form>
    ) 
} 
