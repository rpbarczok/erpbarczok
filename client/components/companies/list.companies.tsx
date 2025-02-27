import '../../style.css'
import './companies.css'
import { ListGroup, Col, Button, Row } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import { DataWithMeta } from '../forms.jsx'
import { Company } from "./companies.jsx"
import { Pencil } from 'react-bootstrap-icons'

interface ListCompaniesInterface {
    search: string
    activeCompany: DataWithMeta<Company>
    onChangeActive: (active: number) => void
    isNew: boolean
    setIsNew: React.Dispatch<React.SetStateAction<boolean>>
    listCompanies: DataWithMeta<Company>[]
}

export function ListCompanies({ search, activeCompany, onChangeActive, isNew, setIsNew, listCompanies }: ListCompaniesInterface) {

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
            onChangeActive(0)
        } else {
            if (!newList.some((e) => e.meta.location === activeCompany.meta.location)) {
                onChangeActive(newList[0].meta.location)
            }
        }

        setListFiltered(newList)
        setIsNew(false)
    }, [search, listCompanies])

    if (listFiltered.length === 0) {
        return (
            <p>Keine Firmen gefunden!</p>
        )
    } else {
        return listFiltered.map((element) => {
            return (
                <ListGroup.Item className="standardDesign" key={element.meta.location} active={element.meta.location === activeCompany.meta.location} onClick={() => onChangeActive(element.meta.location)}>
                    {element.data.name + (element.data.abbr ? " (" + element.data.abbr + ")" : "")}
                </ListGroup.Item>
            )

        }
        )
    }
}

export function ListCompaniesXS({ search, activeCompany, onChangeActive, isNew, setIsNew, listCompanies }: ListCompaniesInterface) {

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
            onChangeActive(0)
        } else {
            if (!newList.some((e) => e.meta.location === activeCompany.meta.location)) {
                onChangeActive(newList[0].meta.location)
            }
        }

        setListFiltered(newList)
        setIsNew(false)
    }, [search, listCompanies])

    if (listFiltered.length === 0) {
        return (
            <ListGroup.Item className="standardDesign" key='none' active={false}>
                <Col xs={6}>
                    Keine Firmen gefunden!
                </Col>
                <Col xs={6}>

                </Col>
            </ListGroup.Item>
        )
    } else {
        return listFiltered.map((element) => {
            return (
                <ListGroup.Item className="standardDesign lineWithButton" key={element.meta.location} >
                    <Row>
                        <Col>
                            <span onClick={() => onChangeActive(element.meta.location)}>{element.data.name + (element.data.abbr ? " (" + element.data.abbr + ")" : "")}</span>
                        </Col>
                        <Col xs="auto">
                            <Button size="sm" variant='outline-primary' ><Pencil /></Button>
                        </Col>
                    </Row>


                </ListGroup.Item>
            )

        }
        )
    }
}