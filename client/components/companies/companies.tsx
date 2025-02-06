import '../../style.css'
import './companies.css'
import { Col, Row } from 'react-bootstrap'
import Heading from '../headings/heading.jsx'
import EditCompanies from './edit.companies.jsx'
import SearchCompanies from './search.companies.jsx'
import AddCompanies from './add.companies.jsx'
import ListCompanies from './list.companies.jsx'
import { useState, useEffect, MouseEvent, useReducer } from 'react'
import { DataWithMeta } from '../forms.jsx'
import { client } from '../../utils/openapiclientaxios.js'
import { removeBeforeLastDigits } from '../../utils/removeBeforeLastDigits.js'
import { Notes, Note } from 'components/notifiers/notifiers.jsx'
import { changeCompanyReducer } from './company.reducer.js'
import { useNotifier } from 'components/notifiers/useNotifier.js'
import { useCompanytypes } from 'components/admin/companytypes/useCompanytypes.js'
import ChangeFrameCompanies from './changeFrame.companies.jsx'

export interface Company {
    "name": string
    "companytype": string
    "abbr"?: string
    "www"?: string
}

export interface ChangeCompanyAction {
    type: 'nameChange' | 'abbrChange' | 'wwwChange' | 'companytypeChange' | 'companyChange'
    newValue: string | DataWithMeta<Company>
}

export const blandCompany: DataWithMeta<Company> = { "meta": { "location": 0, "etag": "" }, "data": { "name": "", "companytype": "default", "abbr": "", "www": "" } }

export default function Companies() {

    const [companyIsChanged, setCompanyIsChanged] = useState<boolean>(true)
    const [listCompanies, setListCompanies] = useState<DataWithMeta<Company>[]>([])
    const [activeCompany, setActiveCompany] = useState<DataWithMeta<Company>>(blandCompany)
    const [search, setSearch] = useState<string>("")
    const [isNew, setIsNew] = useState<boolean>(false)
    const [show, setShow] = useState<boolean>(false) // to handle the modal
    const [isCompanytypeChanged, setIsCompanytypeChanged] = useState(true)

    const [notes, removeNote, addNote] = useNotifier()
    const listCompanytypes = useCompanytypes(isCompanytypeChanged, setIsCompanytypeChanged)

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
                    }
                })
                .catch(error => {
                    const note: Note = {
                        variant: 'danger',
                        message: `Diese Firma wurde nicht gefunden.`,
                    }
                    addNote(note)
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
                    <ChangeFrameCompanies listCompanytypes={listCompanies} activeCompany={activeCompany} addMainNotes={addNote}/>
                </Col>
                <Col>
                </Col>
            </Row>
            <hr />
            <Row>
                <Notes notes={notes} removeNote={removeNote}/>
                <ChangeFrameCompanies listCompanytypes={listCompanies} activeCompany={activeCompany} addMainNotes={addNote} />
            </Row>
        </>
    )
}