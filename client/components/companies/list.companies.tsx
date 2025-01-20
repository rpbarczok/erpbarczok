import "../../style.css"
import {ListGroup} from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import {Loc} from '../../app.js'
import { Company } from "./companies.js"

interface ListCompaniesInterface {
    search: string
    active: string
    onChangeActive: Function
    isNew: boolean
    setIsNew: React.Dispatch<React.SetStateAction<boolean>>
    listCompanies: Loc<Company>[]
}

export default function ListCompanies({search, active, onChangeActive, isNew, setIsNew, listCompanies}: ListCompaniesInterface) {

    const [listFiltered, setListFiltered] = useState<Loc<Company>[]>([])

    useEffect(() => {
        const newList: Loc<Company>[] = listCompanies.filter((company: Loc<Company>) => {
            if (!isNew) {
                if (company.data.abbr) {
                    if (company.data.name.toLowerCase().includes(search.toLowerCase()) || company.data.abbr.toLowerCase().includes(search.toLowerCase())) {
                        return company
                    }
                } else {
                    if (company.data.name.toLowerCase().includes(search.toLowerCase())) {
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
                            {element.data.name + (element.data.abbr ? " (" + element.data.abbr + ")" : "")}
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        )
    }
}
