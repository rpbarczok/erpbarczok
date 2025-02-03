import '../../style.css'
import './companies.css'
import { Col, Row } from 'react-bootstrap'
import Heading from '../common/heading.jsx'
import EditCompanies from './edit.companies.jsx'
import SearchCompanies from './search.companies.jsx'
import AddCompanies from './add.companies.jsx'
import ListCompanies from './list.companies.jsx'
import { useState, useEffect } from 'react'
import { DataWithMeta } from '../forms.jsx'
import { client } from '../../utils/openapiclientaxios.js'
import { removeBeforeLastDigits } from '../../utils/removeBeforeLastDigits.js'
import { Companytype } from 'components/admin/companytypes/companytypes.js'

export interface Company {
    "name": string
    "companytype": string
    "abbr"?: string
    "www"?: string
}

interface CompanyInterface {
    listCompanytypes: DataWithMeta<Companytype>[]
}

export default function Companies({listCompanytypes}: CompanyInterface) {
    const [companyIsChanged, setCompanyIsChanged] = useState<boolean>(true)
    const [listCompanies, setListCompanies] = useState<DataWithMeta<Company>[]>([])
    const [activeCompany, setActiveCompany] = useState<DataWithMeta<Company>>({ "meta": { "location": 0, "etag": "" }, "data": { "name": "", "companytype": "", "abbr": "", "www": "" } })
    const [search, setSearch] = useState<string>("")
    const [isNew, setIsNew] = useState<boolean>(false)

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
            setActiveCompany({ "meta": { "location": 0, "etag": "" }, "data": { "name": "", "companytype": "", "abbr": "", "www": "" } })
        } else {
            client.getCompanyById(active)
                .then(result => {
                    if (result.data) {
                        const company = { "meta": { 'location': Number(removeBeforeLastDigits(result.headers.location)), 'etag': result.headers.etag }, 'data': result.data }
                        setActiveCompany(company)
                    }
                })
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
                        setCompanyIsChanged={setCompanyIsChanged}
                        onChangeActive={handleChangeActive}
                        setIsNew={setIsNew}
                        listCompanytypes={listCompanytypes}
                    />
                </Col>
                <Col>
                </Col>
            </Row>
            <hr />
            <Row id="edit">
                {activeCompany.meta.location === 0 ? 
                <p>Keine Firma gefunden</p> : 
                <EditCompanies key={activeCompany.meta.location} setCompanyIsChanged={setCompanyIsChanged} activeCompany={activeCompany} listCompanytypes={listCompanytypes} />}
            </Row>
        </>
    )
}