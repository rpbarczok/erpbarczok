import '../../style.css'
import './companies.css'
import { Col, Row } from 'react-bootstrap'
import Heading from '../common/heading.jsx'
import EditCompanies from './edit.companies.jsx'
import SearchCompanies from './search.companies.jsx'
import AddCompanies from './add.companies.jsx'
import ListCompanies from './list.companies.jsx'
import { useState, useEffect, MouseEvent } from 'react'
import { DataWithMeta } from '../forms.jsx'
import { client } from '../../utils/openapiclientaxios.js'
import { removeBeforeLastDigits } from '../../utils/removeBeforeLastDigits.js'
import { Companytype } from 'components/admin/companytypes/companytypes.jsx'

export interface Company {
    "name": string
    "companytype": string
    "abbr"?: string
    "www"?: string
}

interface CompanyInterface {
    listCompanytypes: DataWithMeta<Companytype>[]
}

export default function Companies({ listCompanytypes }: CompanyInterface) {
    const blandCompany = { "meta": { "location": 0, "etag": "" }, "data": { "name": "", "companytype": "default", "abbr": "", "www": "" } }
    const [companyIsChanged, setCompanyIsChanged] = useState<boolean>(true)
    const [listCompanies, setListCompanies] = useState<DataWithMeta<Company>[]>([])
    const [activeCompany, setActiveCompany] = useState<DataWithMeta<Company>>(blandCompany)
    const [search, setSearch] = useState<string>("")
    const [isNew, setIsNew] = useState<boolean>(false)
    const [changeCompany, setChangeCompany] = useState<DataWithMeta<Company>>(blandCompany)
    const [show, setShow] = useState<boolean>(false) // to handle the modal

    useEffect(() => {
        if (companyIsChanged) {
            client.getCompanies()
                .then(result => {
                    const newList = result?.data.map(row => {
                        const newRow: DataWithMeta<Company> = {
                            meta: {
                                location: Number(removeBeforeLastDigits(row.meta.location)),
                                etag: row.meta.etag
                            },
                            data: row.data
                        }
                        return (newRow)
                    })
                    setListCompanies(newList)
                })
            setCompanyIsChanged(false)
        }
    }, [companyIsChanged])

    function handleChangeActive(active: number) {
        if (active === 0 || active === undefined) {
            setActiveCompany(blandCompany)
        } else {
            client.getCompanyById(active)
                .then(result => {
                    if (result.data) {
                        const company = { "meta": { 'location': Number(removeBeforeLastDigits(result.headers.location)), 'etag': result.headers.etag }, 'data': result.data }
                        setActiveCompany(company)
                        setChangeCompany(company)
                    }
                })
        }
    }

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (changeCompany.data.name !== "") {
            if (changeCompany.meta.location === 0) {
                client.postCompany(null, changeCompany.data)
                .then((res) => {
                    setCompanyIsChanged(true)
                    setIsNew(true)
                    handleChangeActive(Number(removeBeforeLastDigits(res.headers.location)))
                    setChangeCompany(blandCompany)
                    setShow(false)
                })
            } else {
                client.putCompanyById({ id: changeCompany.meta.location, "if-match": changeCompany.meta.etag },
                    changeCompany.data)
                    .then((res) => {
                        setCompanyIsChanged(true)
                    })
                    .catch(function (error) {
                        throw error
                    })
            }
        }
    }



    return (
        <>
            <Row id="heading">
                <Heading title="Stammdaten: Kunden, Lieferanten, Spediteure" cssClass="stammForm" />
            </Row>
            <Row className="suche">
                <Col>
                    <SearchCompanies search={search} setSearch={setSearch} />
                </Col>
                <Col>
                    <ListCompanies
                        search={search}
                        activeCompany={activeCompany} onChangeActive={handleChangeActive}
                        isNew={isNew} setIsNew={setIsNew}
                        listCompanies={listCompanies}
                    />
                </Col>
                <Col>
                    <AddCompanies
                        listCompanytypes={listCompanytypes}
                        handleSubmit={handleSubmit}
                        changeCompany={changeCompany}
                        setChangeCompany={setChangeCompany}
                        setShow={setShow}
                        show={show}
                    />
                </Col>
                <Col>
                </Col>
            </Row>
            <hr />
            <Row id="edit">
                {activeCompany.meta.location === 0 ?
                    <p>Keine Firma gefunden</p> :
                    <EditCompanies
                        key={activeCompany.meta.location}
                        setCompanyIsChanged={setCompanyIsChanged}
                        activeCompany={activeCompany}
                        listCompanytypes={listCompanytypes} 
                        changeCompany={changeCompany}
                        setChangeCompany={setChangeCompany}
                        handleSubmit={handleSubmit}
                        />}
            </Row>
        </>
    )
}