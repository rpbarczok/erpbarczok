import '../../style.css'
import './companies.css'
import { Button, ButtonGroup, Col, ListGroup, Row } from 'react-bootstrap'
import { Heading } from '../headings/heading.jsx'
import { SearchCompanies } from './search.companies.jsx'
import { ListCompanies, ListCompaniesXS } from './list.companies.jsx'
import { useState, useEffect } from 'react'
import { DataWithMeta } from '../forms.jsx'
import { client } from '../../utils/openAPIClientAxios.js'
import { removeBeforeLastDigits } from '../../utils/removeBeforeLastDigits.js'
import { useCompanyTypes } from 'components/admin/companyTypes/useCompanyTypes.js'
import { InputCompanies } from './input.companies.jsx'
import { Note } from 'components/notifiers/notifiers.jsx'
import { useNotifier } from 'components/notifiers/useNotifier.js'
import { useAuth } from 'react-oidc-context'

export interface Company {
    "name": string
    "companyType": string
    "abbr"?: string
    "www"?: string
}

export interface ChangedCompanyAction {
    type: 'nameChange' | 'abbrChange' | 'wwwChange' | 'companyTypeChange' | 'companyChange'
    newValue: string | DataWithMeta<Company>
}

export const blandCompany: DataWithMeta<Company> = { "meta": { "location": 0, "etag": "" }, "data": { "name": "", "companyType": "default", "abbr": "", "www": "" } }

export function Companies() {

    const [companyIsChanged, setIsCompanyChanged] = useState<boolean>(true)
    const [listCompanies, setListCompanies] = useState<DataWithMeta<Company>[]>([])
    const [activeCompany, setActiveCompany] = useState<DataWithMeta<Company>>(blandCompany)
    const [search, setSearch] = useState<string>("")
    const [isNew, setIsNew] = useState<boolean>(false)
    const [listCompanyTypes] = useCompanyTypes()
    const [editNotes, addEditNote, removeEditNote] = useNotifier()
    const auth = useAuth()
    const token = auth.user?.access_token

    useEffect(() => {
        if (companyIsChanged) {
            try {
                client.getCompanies(null, null, { headers: { 'Authorization': `Bearer ${token}` } })
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
            } catch (error) {
                throw error
            }
        }
    }, [companyIsChanged])

    function handleChangeActive(active: number) {
        if (active === 0 || active === undefined) {
            setActiveCompany(blandCompany)
        } else {
            client.getCompanyById(active, null, { headers: { Authorization: `Bearer ${token}` } })
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


    const ButtonGeneral = () => {
        const [show, setShow] = useState<boolean>(false)
        const [newCompanyClick, setNewCompanyClick] = useState<number>(0)

        const handleShow = () => {
            setNewCompanyClick(newCompanyClick + 1)
            setShow(true)
        }

        const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            const userConfirmed = window.confirm(`Willst du die Firma '${activeCompany.data.name}' wirklich löschen?`)
            if (userConfirmed) {
                client.deleteCompanyById(activeCompany.meta.location, null, { headers: { Authorization: `Bearer ${token}` } })
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


        return (
            <ButtonGroup vertical>
                <Button className="standardDesign" variant="outline-primary" onClick={handleShow}>Firma hinzufügen</Button>
                <InputCompanies
                    key={String(newCompanyClick)}
                    listCompanyTypes={listCompanyTypes}
                    company={blandCompany}
                    setIsCompanyChanged={setIsCompanyChanged}
                    addEditNote={addEditNote}
                    setIsNew={setIsNew}
                    onChangeActive={handleChangeActive}
                    show={show} setShow={setShow}
                />
                <Button className="standardDesign" variant="outline-danger" onClick={(e) => handleDelete(e)}>Firma löschen</Button>
            </ButtonGroup >
        )
    }


    return (
        <>
            <Row id="heading">
                <Heading title="Stammdaten: Kunden, Lieferanten, Spediteure" cssClass="stammForm" />
            </Row>
            <Row className="suche">
                <Col xs={12} sm={5} md={4}>
                    <SearchCompanies search={search} setSearch={setSearch} />
                </Col>
                <Col xs={12} sm={7} md={5}>
                    <ListGroup className="scrollBox suchListe standardDesign d-none d-sm-block" id="company-list">
                        <ListCompanies
                            search={search}
                            activeCompany={activeCompany}
                            onChangeActive={handleChangeActive}
                            isNew={isNew} setIsNew={setIsNew}
                            listCompanies={listCompanies}
                        />
                    </ListGroup>
                    <ListGroup className="scrollBoxXS standardDesign d-sm-none" id="company-list">
                        <ListCompaniesXS
                            search={search}
                            activeCompany={activeCompany}
                            onChangeActive={handleChangeActive}
                            isNew={isNew} setIsNew={setIsNew}
                            listCompanies={listCompanies}
                        />
                    </ListGroup>
                </Col>
                <Col className="d-none d-md-block" md={3}>
                    {(auth.user?.scope as string).indexOf('user') !== -1 ? <ButtonGeneral /> : ''}
                </Col>
                <Col>
                </Col>
            </Row>
                        <Row className="d-none d-sm-block d-md-none">
                {(auth.user?.scope as string).indexOf('user') !== -1 ? <ButtonGeneral /> : ''}
            </Row>
            <hr className="d-none d-sm-block" />
            <Row className="d-none d-sm-block">
                {activeCompany.meta.location === 0
                    ? <p>Keine Firma gefunden</p>
                    : <InputCompanies
                        key={activeCompany.meta.location}
                        listCompanyTypes={listCompanyTypes}
                        company={activeCompany}
                        setIsCompanyChanged={setIsCompanyChanged}
                        editNotes={editNotes} addEditNote={addEditNote} removeEditNote={removeEditNote} />}
            </Row>
        </>
    )
}