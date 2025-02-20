import '../../style.css'
import './companies.css'
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap'
import { Heading } from '../headings/heading.jsx'
import { SearchCompanies } from './search.companies.jsx'
import { ListCompanies } from './list.companies.jsx'
import { useState, useEffect } from 'react'
import { DataWithMeta } from '../forms.jsx'
import { client } from '../../utils/openapiclientaxios.js'
import { removeBeforeLastDigits } from '../../utils/removeBeforeLastDigits.js'
import { useCompanytypes } from 'components/admin/companytypes/useCompanytypes.js'
import { InputCompanies } from './input.companies.jsx'
import { Note } from 'components/notifiers/notifiers.jsx'
import { useNotifier } from 'components/notifiers/useNotifier.js'
import { useAuth } from 'react-oidc-context'

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

export function Companies() {

    const [companyIsChanged, setIsCompanyChanged] = useState<boolean>(true)
    const [listCompanies, setListCompanies] = useState<DataWithMeta<Company>[]>([])
    const [activeCompany, setActiveCompany] = useState<DataWithMeta<Company>>(blandCompany)
    const [search, setSearch] = useState<string>("")
    const [isNew, setIsNew] = useState<boolean>(false)
    const [listCompanytypes] = useCompanytypes()
    const [show, setShow] = useState<boolean>(false)
    const [newCompanyClick, setNewCompanyClick] = useState<number>(0)
    const [editNotes, addEditNote, removeEditNote] = useNotifier()
    const auth = useAuth()
    const token = auth.user?.access_token

    useEffect(() => {
        if (companyIsChanged) {
            try {
                if (auth.isAuthenticated) {
                    client.getCompanies(null, null, { headers: { 'Authorization': `Bearer ${token}` }})
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
                } else {
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
                }
               
            setIsCompanyChanged(false)
            } catch (error) {
               throw error
            }
        }
    }, [companyIsChanged])

    function handleChangeActive(active: number) {
        if (active === 0 || active === undefined) {
            setActiveCompany(blandCompany)
        } else {
            client.getCompanyById(active, null, { headers: { Authorization: `Bearer ${token}` }})
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

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const userConfirmed = window.confirm(`Willst du die Firma '${activeCompany.data.name}' wirklich löschen?`)
        if (userConfirmed) {
            client.deleteCompanyById(activeCompany.meta.location, null,  { headers: { Authorization: `Bearer ${token}` }})
                .then((res) => {
                    setIsCompanyChanged(true)
                    const note: Note = {
                        variant: 'warning',
                        message: `Firma wurde gelöscht. Aktuell gibt es keine Möglichkeit, die Daten zurückzuholen`,
                    }
                    addEditNote(note)
                })
                .catch(error => {
                    const note: Note = {
                        variant: 'danger',
                        message: `Löschen der Firma hat nicht geklappt: ${error.message}`,
                    }
                    addEditNote(note)
                })

        }
    }

    const handleShow = () => {
        setNewCompanyClick(newCompanyClick + 1)
        setShow(true)
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
                    <ButtonGroup vertical>
                        <Button className="standardDesign" variant="outline-primary" onClick={handleShow}>Firma hinzufügen</Button>
                        <InputCompanies
                            key={String(newCompanyClick)}
                            listCompanytypes={listCompanytypes}
                            company={blandCompany}
                            setIsCompanyChanged={setIsCompanyChanged}
                            addEditNote={addEditNote}
                            setIsNew={setIsNew}
                            onChangeActive={handleChangeActive}
                            show={show} setShow={setShow}
                        />
                        <Button className="standardDesign" variant="outline-danger" onClick={(e) => handleDelete(e)}>Firma löschen</Button>
                    </ButtonGroup >
                </Col>
                <Col>
                </Col>
            </Row>
            <hr />
            <Row>
                {activeCompany.meta.location === 0
                    ? <p>Keine Firma gefunden</p>
                    : <InputCompanies
                        key={activeCompany.meta.location}
                        listCompanytypes={listCompanytypes}
                        company={activeCompany}
                        setIsCompanyChanged={setIsCompanyChanged}
                        editNotes={editNotes} addEditNote={addEditNote} removeEditNote={removeEditNote} />}
            </Row>
        </>
    )
}