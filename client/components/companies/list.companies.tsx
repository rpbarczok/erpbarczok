import '../../style.css'
import './companies.css'
import { ListGroup } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import { DataWithMeta } from '../../app.jsx'
import { Company } from "./companies.jsx"
import { List } from 'react-bootstrap-icons'

interface ListCompaniesInterface {
    search: string
    activeCompany: DataWithMeta<Company>
    onChangeActive: Function
    isNew: boolean
    setIsNew: React.Dispatch<React.SetStateAction<boolean>>
    listCompanies: DataWithMeta<Company>[]
}

export default function ListCompanies({ search, activeCompany, onChangeActive, isNew, setIsNew, listCompanies }: ListCompaniesInterface) {

    const [listFiltered, setListFiltered] = useState<DataWithMeta<Company>[]>([])

    useEffect(() => {
        const newList: DataWithMeta<Company>[] = listCompanies.filter((company: DataWithMeta<Company>) => {
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
            if (!newList.some((e) => e.meta.location === activeCompany.meta.location)) {
                onChangeActive(newList[0].meta.location)
            }
        }

        setListFiltered(newList)
        setIsNew(false)
    }, [search, listCompanies])

    const handleClick = (e: React.MouseEvent<Element, MouseEvent>, active: string) => {
        e.preventDefault()
        onChangeActive(active)
    }

    if (listFiltered.length === 0) {
        return (
            <ListGroup className="scrollBox suchListe standardDesign" id="company-list">
                <p>Keine Firmen gefunden!</p>
            </ListGroup>
        )
    } else {
        return (
            <ListGroup className="scrollBox suchListe standardDesign" id="company-list">
                {listFiltered.map((element) => {
                    return (
                        <ListGroup.Item className="standardDesign" key={element.meta.location} active={element.meta.location === activeCompany.meta.location} onClick={() => onChangeActive(element.meta.location)}>
                            {element.data.name + (element.data.abbr ? " (" + element.data.abbr + ")" : "")}
                        </ListGroup.Item>
                    )

                })}
            </ListGroup>
        )
    }
}
