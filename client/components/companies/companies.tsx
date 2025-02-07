import '../../style.css'
import './companies.css'
import { Col, Row } from 'react-bootstrap'
import Heading from '../headings/heading.jsx'
import SearchCompanies from './search.companies.jsx'
import ListCompanies from './list.companies.jsx'
import { useState, useEffect } from 'react'
import { DataWithMeta } from '../forms.jsx'
import { client } from '../../utils/openapiclientaxios.js'
import { removeBeforeLastDigits } from '../../utils/removeBeforeLastDigits.js'
import { useCompanytypes } from 'components/admin/companytypes/useCompanytypes.js'
import ChangeFrameCompanies from './changeFrame.companies.jsx'
import AddCompanies from './add.companies.jsx'
import EditCompanies from './edit.companies.jsx'

export interface Company {
    "name": string
    "companytype": string
    "abbr"?: string
    "www"?: string
}

export interface ChangedCompanyAction {
    type: 'nameChange' | 'abbrChange' | 'wwwChange' | 'companytypeChange' | 'companyChange'
    newValue: string | DataWithMeta<Company>
}

export const blandCompany: DataWithMeta<Company> = { "meta": { "location": 0, "etag": "" }, "data": { "name": "", "companytype": "default", "abbr": "", "www": "" } }

export default function Companies() {

    const [companyIsChanged, setIsCompanyChanged] = useState<boolean>(true)
    const [listCompanies, setListCompanies] = useState<DataWithMeta<Company>[]>([])
    const [activeCompany, setActiveCompany] = useState<DataWithMeta<Company>>(blandCompany)
    const [search, setSearch] = useState<string>("")
    const [isNew, setIsNew] = useState<boolean>(false)
    const [listCompanytypes] = useCompanytypes()

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
            setIsCompanyChanged(false)
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
                    }
                })
                .catch(error => {
                    throw error
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
                        activeCompany={activeCompany}
                        onChangeActive={handleChangeActive}
                        isNew={isNew} setIsNew={setIsNew}
                        listCompanies={listCompanies}
                    />
                </Col>
                <Col>
                    <ChangeFrameCompanies
                        listCompanytypes={listCompanytypes}
                        changedCompanyBasis={blandCompany}
                        setIsCompanyChanged={setIsCompanyChanged}
                        setIsNew={setIsNew}
                        onChangeActive={handleChangeActive}
                    />
                </Col>
                <Col>
                </Col>
            </Row>
            <hr />
            <Row>
                {activeCompany.meta.location === 0
                    ? <p>Keine Firma gefunden</p>
                    : <ChangeFrameCompanies
                        key={activeCompany.meta.location}
                        listCompanytypes={listCompanytypes}
                        changedCompanyBasis={activeCompany}
                        setIsCompanyChanged={setIsCompanyChanged}
                    />}
            </Row>
        </>
    )
}