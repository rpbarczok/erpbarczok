import '../../../style.css'
import '../admin.css'
import { ListGroup, Row } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { DataWithMeta } from 'app.jsx'
import { Companytype } from 'components/companies/companies.jsx'
import AddCompanytypes from './add.companytypes.admin.jsx'
import ListCompanytypes from './list.comanytypes.admin.jsx'

const Companytypes = () => {
    const [isChanged, setIsChanged] = useState<boolean>(true)
    const [listCompanytypes, setListCompanytypes] = useState<DataWithMeta<Companytype>[]>([])

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
                < ListGroup className="standardDesign" id="company-list" >
                    <ListCompanytypes listCompanytypes={listCompanytypes} setIsChanged={setIsChanged}/>
                    <AddCompanytypes setIsChanged={setIsChanged} />
                </ListGroup >
            </Row>
        </>
    )
}

export default Companytypes