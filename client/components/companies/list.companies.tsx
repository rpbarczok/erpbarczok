import "../../style.css"
import {ListGroup} from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import { CompanyLoc } from "./companies.js"



export default function ListCompanies({search, active, onChangeActive, isNew, setIsNew, listCompanies}) {

    const [listFiltered, setListFiltered] = useState<CompanyLoc[]>([])

    useEffect(() => {
        const newList: CompanyLoc[] = listCompanies.filter((company: CompanyLoc) => {
            if (!isNew) {
                if (company.company.abbr) {
                    if (company.company.name.toLowerCase().includes(search.toLowerCase()) || company.company.abbr.toLowerCase().includes(search.toLowerCase())) {
                        return company
                    }
                } else {
                    if (company.company.name.toLowerCase().includes(search.toLowerCase())) {
                        return company
                    }
                }
            } else {
                return company
            }
        })

        if (newList.length === 0) {
            onChangeActive("")
        } else {
            if (!newList.some((e) => e.location === active)) {
                onChangeActive(newList[0].location)
            }
        }

        setListFiltered(newList)
        setIsNew(false)
    }, [search, listCompanies])

    if (listFiltered.length === 0) {
        return (
            <ListGroup className="scrollBox suchListe smallDesign" id="company-list">
                <p>Keine Firmen gefunden!</p>
            </ListGroup>
        )
    } else {
        return (
            <ListGroup className="scrollBox suchListe smallDesign" id="company-list">
                {listFiltered.map((element) => {
                    return (
                        <ListGroup.Item className="smallDesign" key={element.location} active={element.location === active} onClick={() => onChangeActive(element.location)}>
                            {element.company.name + (element.company.abbr ? " (" + element.company.abbr + ")" : "")}
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        )
    }
}
