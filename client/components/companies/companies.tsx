import { Col, Row } from 'react-bootstrap'
import "../../style.css"
import Heading from '../common/heading.js'
import SpecificCompanies from './specific.companies.js'
import SearchCompanies from './search.companies.js'
import AddCompanies from './add.companies.js'
import ListCompanies from './list.companies.js'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export interface Company {
    "name": string
    "abbr"?: string
    "www"?: string
}

export interface CompanyLoc {
    "location": string,
    "company": Company
}

export interface Companytype {
    "name": string
}

export default function Companies() {
    const [isChanged, setIsChanged] = useState<boolean>(true)
    const [listCompanies, setListCompanies] = useState<CompanyLoc[]>([])
    const [activeCompany, setActiveCompany] = useState<CompanyLoc>({ "location": "", "company": { "abbr": "", "name": "", "www": "" } })
    const [listCompanytypes, setListCompanytypes] = useState<Companytype[]>([])
    const [search, setSearch] = useState<string>("")
    const [isNew, setIsNew] = useState<boolean>(false)

    useEffect(() => {
        if (isChanged) {
            axios.get("http://localhost:8080/companies/")
                .then(result => {
                    setListCompanies(result?.data)
                })
            setIsChanged(false)
        }
    }, [isChanged])

    useEffect(() => {
        {
            axios.get("http://localhost:8080/companytypes/")
                .then(result => {
                    setListCompanytypes(result?.data)
                })
        }
    }, [])

    function handleChangeActive(active: string) {
        if (active === "" || active === undefined) {
            setActiveCompany({ "location": "", "company": { "abbr": "", "name": "", "www": "" } })
        } else {
            axios.get(`http://localhost:8080${active}`)
                .then(result => {
                    setActiveCompany(result.data)
                })
        }
    }

    return (
        <>
            <Row id="heading">
                <Heading title="Stammdaten: Kunden, Lieferanten, Spediteure" cssClass = "stammForm"/>
            </Row>
            <Row className="suche">
                <Col>
                    <SearchCompanies search={search} setSearch={setSearch} />
                </Col>
                <Col>
                    <ListCompanies
                        search={search}
                        active={activeCompany} onChangeActive={handleChangeActive}
                        isNew={isNew} setIsNew={setIsNew}
                        listCompanies={listCompanies}
                    />
                </Col>
                <Col>
                    <AddCompanies
                        setIsChanged={setIsChanged}
                        onChangeActive={handleChangeActive}
                        setIsNew={setIsNew}
                        listCompanytypes={listCompanytypes}
                    />
                </Col>
                <Col>
                </Col>
            </Row>
            <hr />
            <Row id="specific">
                {activeCompany.location === "" ? <p>Keine Firma gefunden</p> : <SpecificCompanies key={activeCompany.location} setIsChanged={setIsChanged} activeCompany={activeCompany} />}
            </Row>
        </>
    )
}