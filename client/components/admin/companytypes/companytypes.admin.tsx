import { ListGroup, Row } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Loc } from 'app.jsx'
import { Companytype } from 'components/companies/companies.jsx'
import ListCompanytypes from './list.comanytypes.admin.jsx'

const Companytypes = () => {
    const [isChanged, setIsChanged] = useState<boolean>(true)
    const [listCompanytypes, setListCompanytypes] = useState<Loc<Companytype>[]>([])

    useEffect(() => {
        if (isChanged) {
            axios.get("/companytypes/")
                .then(result => {
                    setListCompanytypes(result?.data)
                })
            setIsChanged(false)
        }
    }, [isChanged])

    return (
        <>
            <Row>
                <h1>Firmenrolle</h1>
            </Row>
            <Row>
                <ListCompanytypes listCompanytypes={listCompanytypes} setIsChanged=  {setIsChanged}/>
            </Row>
        </>
    )
}

export default Companytypes