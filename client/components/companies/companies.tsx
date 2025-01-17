import {Row} from 'react-bootstrap'
import "../../style.css"
import HeadingCompanies from './heading.companies.js'
import GeneralCompanies from './general.companies.js'
import SpecificCompanies from './specific.companies.js'
import React, {useState, useEffect} from 'react'  
import axios from 'axios'
import { Loc } from '../../app.js'

export interface Company {
    "name": string
    "abbr"?: string
    "www"?: string
}

export default function Companies() {
    const [isChanged, setIsChanged] = useState<boolean>(true)
    const [listCompanies, setListCompanies] = useState<Loc<Company>[]>([])
    const [activeCompany, setActiveCompany] = useState<Loc<Company>>({ "location": "", "data": { "abbr": "", "name": "", "www": "" } })

    useEffect(() => {
        if (isChanged)
        {
            axios.get("/companies/")
            .then(result => {
                setListCompanies(result?.data)
            })
            setIsChanged(false)
        } 
    }, [isChanged])

    function handleChangeActive(active: string) {
        if (active === "" || active === undefined) {
            setActiveCompany({ "location": "", "data": { "abbr": "", "name": "", "www": "" } })
        } else {
            axios.get(active)
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