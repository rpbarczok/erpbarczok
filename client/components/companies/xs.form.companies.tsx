import React from "react"
import { Col, Row } from "react-bootstrap"
import { XSSearchCompanies } from "./xs.search.companies.jsx"
import { DataWithMeta } from "components/forms.jsx"
import { Company } from "./companies.jsx"
import { XSListCompanies } from "./xs.list.companies.jsx"

interface XSFormCompaniesComponent {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    filteredCompanies: DataWithMeta<Company>[]
}

export const XSFormCompanies = ({ search, setSearch, filteredCompanies }: XSFormCompaniesComponent) => {
    return (
        <>
            <Row>
                <Col xs={12}>
                    <XSSearchCompanies search={search} setSearch={setSearch} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <XSListCompanies
                        filteredCompanies={filteredCompanies}
                    />
                </Col>
            </Row>
        </>
    )
}
