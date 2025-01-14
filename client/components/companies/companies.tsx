import {Row} from 'react-bootstrap'
import "../../style.css"
import HeadingCompanies from './heading.companies.js'
import GeneralCompanies from './general.companies.js'
import SpecificCompanies from './specific.companies.js'
import React, {useState, useEffect} from 'react'  
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

export default function Companies() {
    const [isChanged, setIsChanged] = useState<boolean>(true)
    const [listCompanies, setListCompanies] = useState<CompanyLoc[]>([])
    const [activeCompany, setActiveCompany] = useState<CompanyLoc>({ "location": "", "company": { "abbr": "", "name": "", "www": "" } })

    useEffect(() => {
        if (isChanged)
        {
            axios.get("http://localhost:8080/companies/")
            .then(result => {
                setListCompanies(result?.data)
            })
            setIsChanged(false)
        } 
    }, [isChanged])

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
            <Row id = "heading">
                <HeadingCompanies/>
            </Row>
            <Row id="search">
                <GeneralCompanies 
                    active={activeCompany.location} onChangeActive={handleChangeActive} 
                    setIsChanged={setIsChanged}
                    listCompanies = {listCompanies}
                />
            </Row>
            <hr />
            <Row id="specific">
               {activeCompany.location === "" ?<p>Keine Firma gefunden</p>:<SpecificCompanies key={activeCompany.location} setIsChanged={setIsChanged} activeCompany={activeCompany}/>}   
            </Row>
        </>
    )
}