import "../../style.css"
import {ListGroup} from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { CompanyLoc, Company } from "./companies.js"


export default function ListCompanies(props) {

    const [listFiltered, setListFiltered] = useState<CompanyLoc[]>([])

    useEffect(() => {
        const newList: CompanyLoc[] = props.listCompanies.filter((company: CompanyLoc) => {
            if (!props.isNew) {
                if (company.company.abbr) {
                    if (company.company.name.toLowerCase().includes(props.search.toLowerCase()) || company.company.abbr.toLowerCase().includes(props.search.toLowerCase())) {
                        return company
                    }
                } else {
                    if (company.company.name.toLowerCase().includes(props.search.toLowerCase())) {
                        return company
                    }
                }
            } else {
                return company
            }
        })

        if (newList.length === 0) {
            props.onChangeActive("")
        } else {
            if (!newList.some((e) => e.location === props.active)) {
                props.onChangeActive(newList[0].location)
            }
        }

        setListFiltered(newList)
        props.setIsNew(false)
    }, [props.search, props.listCompanies])

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
                        <ListGroup.Item className="smallDesign" key={element.location} active={element.location === props.active} onClick={() => props.onChangeActive(element.location)}>
                            {element.company.name + (element.company.abbr ? " (" + element.company.abbr + ")" : "")}
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        )
    }
}
