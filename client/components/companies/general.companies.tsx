import { Col, Row } from 'react-bootstrap'
import "../../style.css"
import ListCompanies from './list.companies.js'
import AddCompanies from './add.companies.js'
import SearchCompanies from './search.companies.js'
import React, { useState } from 'react'
import { Company, CompanyLoc } from './companies.js'

interface GeneralCompaniesInterface {
    onChangeActive: Function
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>
    active: string
    listCompanies: CompanyLoc[]
}


export default function GeneralCompanies({ onChangeActive, setIsChanged, active, listCompanies }: GeneralCompaniesInterface) {

    const [search, setSearch] = useState<string>("")
    const [isNew, setIsNew] = useState<boolean>(false)

    return (
        <Row className="suche">
            <Col>
                <SearchCompanies search={search} setSearch={setSearch} />
            </Col>
            <Col>
                <ListCompanies
                    search={search}
                    active={active} onChangeActive={onChangeActive}
                    isNew={isNew} setIsNew={setIsNew}
                    listCompanies={listCompanies}
                />
            </Col>
            <Col>
                <AddCompanies
                    setIsChanged={setIsChanged}
                    onChangeActive={onChangeActive}
                    setIsNew={setIsNew}
                />
            </Col>
            <Col>
            </Col>
        </Row>
    )
}  