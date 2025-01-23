import "../../style.css"
import {ListGroup} from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import {Loc} from '../../app.jsx'
import { Company } from "./companies.jsx"

interface ListCompaniesInterface {
    search: string
    activeCompany: Loc<Company>
    onChangeActive: Function
    isNew: boolean
    setIsNew: React.Dispatch<React.SetStateAction<boolean>>
    listCompanies: Loc<Company>[]
}

export default function ListCompanies({search, activeCompany, onChangeActive, isNew, setIsNew, listCompanies}: ListCompaniesInterface) {

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
            if (!newList.some((e) => e.location === activeCompany.location)) {
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
                        <ListGroup.Item className="smallDesign" key={element.location}>
                            {element.data.name}
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        )
    }
}
