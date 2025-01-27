import { Col, Row } from 'react-bootstrap'
import Heading from '../common/heading.jsx'
import EditCompanies from './edit.companies.jsx'
import SearchCompanies from './search.companies.jsx'
import AddCompanies from './add.companies.jsx'
import ListCompanies from './list.companies.jsx'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DataWithMeta } from '../../app.js'

export interface Companytype {
    "name": string
}

export interface Company {
    "name": string
    "abbr"?: string
    "www"?: string
}

export interface CompanyEdit {
    "name": string
    "abbr": string
    "www": string
}

export function transformCompanyEdit(company: CompanyEdit): Company {
    const result: Company = { name: company.name }
    if (company.abbr !== "") {
        result.abbr = company.abbr
    }
    if (company.www !== "") {
        result.www = company.www
    }
    return result
}

export function transformCompany(company: Company): CompanyEdit {
    const result: CompanyEdit = { name: company.name, abbr: "", www: "" }
    if (company.abbr) {
        result.abbr = company.abbr
    }
    if (company.www) {
        result.www = company.www
    }
    return result
}

export default function Companies() {
    const [isChanged, setIsChanged] = useState<boolean>(true)
    const [listCompanies, setListCompanies] = useState<DataWithMeta<Company>[]>([])
    const [listCompanytypes, setListCompanytypes] = useState<DataWithMeta<Companytype>[]>([])
    const [activeCompany, setActiveCompany] = useState<DataWithMeta<Company>>({ "meta": { "location": "", "etag": "" }, "data": { "abbr": "", "name": "", "www": "" } })
    const [search, setSearch] = useState<string>("")
    const [isNew, setIsNew] = useState<boolean>(false)

    useEffect(() => {
        if (isChanged) {
            axios.get("/companies/")
                .then(result => {
                    setListCompanies(result?.data)
                })
            setIsChanged(false)
        }
    }, [isChanged])

    useEffect(() => {
        {
            axios.get("/companytypes/")
                .then(result => {
                    setListCompanytypes(result?.data)
                })
        }
    }, [])

    function handleChangeActive(active: string) {
        if (active === "" || active === undefined) {
            setActiveCompany({ "meta": { "location": "", "etag": "" }, "data": { "abbr": "", "name": "", "www": "" } })
        } else {
            axios.get(active)
                .then(result => {
                    if (result.data) {
                        const company = {"meta": {'location': result.headers.location, 'etag': result.headers['if-match']}, 'data': result.data}
                        setActiveCompany(company)
                    }
                })
        }
    }

    return (
        <>
            <Row id="heading">
                <Heading title="Stammdaten: Kunden, Lieferanten, Spediteure" cssClass="stammForm" />
            </Row>
            <Row className="suche">
                <Col>
                    <SearchCompanies search={search} setSearch={setSearch} />
                </Col>
                <Col>
                    <ListCompanies
                        search={search}
                        activeCompany={activeCompany} onChangeActive={handleChangeActive}
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
            <Row id="edit">
                {activeCompany.meta.location === "" ? <p>Keine Firma gefunden</p> : <EditCompanies key={activeCompany.meta.location} setIsChanged={setIsChanged} activeCompany={activeCompany} listCompanytypes={listCompanytypes} />}
            </Row>
        </>
    )
}