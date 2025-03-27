import { DataWithMeta } from '../../components/forms.jsx'
import { Company } from './companies.jsx'
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap'
import { XSEditCompanies } from './xs.edit.companies.jsx'
import { useState } from 'react'
import { ChangedCompanyAction } from './company.reducer.js'
import { CompanyType } from '../../components/resources/companyTypes/companyTypes.js'
import { Note } from '../../components/notifiers/notifiers.js'

interface XSListCompaniesComponent {
    filteredCompanies: DataWithMeta<Company>[]
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
    activeCompany: DataWithMeta<Company>
    handleChangeActive: (active: number) => void
    companyTypesList: DataWithMeta<CompanyType>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    addEditNote: (note: Note) => void
}

export const XSListCompanies = ({ filteredCompanies, changedCompany, changedCompanyDispatch, activeCompany, companyTypesList, setIsCompanyChanged, handleChangeActive, addEditNote }: XSListCompaniesComponent) => {
    const [show, setShow] = useState(false)
    const handleOpenModal = (e: React.MouseEvent<Element, MouseEvent>, location: number) => {
        e.preventDefault
        handleChangeActive(location)
        setShow(true)
    }
    const List = () => {

        if (filteredCompanies.length === 0) {
            return (
                <p>Keine Unternehmen gefunden!</p>
            )
        } else {
            return filteredCompanies.map((element) => {

                return (
                    <>
                        <ListGroup.Item key={element.meta.location} onClick={(e) => handleOpenModal(e, element.meta.location)}>
                            {element.data.name + (element.data.abbr ? ' (' + element.data.abbr + ')' : '')}
                        </ListGroup.Item>
                    </>
                )
            }
            )
        }
    }



    return (
        <>
            <div className='flex-grow-1 d-flex flex-column' style={{ overflowY: 'hidden', marginTop: '10px' }}>
                <ListGroup id='company-list' style={{ overflowY: 'scroll' }}>
                    <List />
                </ListGroup >
            </div>
            <XSEditCompanies
                show={show} setShow={setShow}
                companyTypesList={companyTypesList}
                addEditNote={addEditNote}
                setIsCompanyChanged={setIsCompanyChanged}
                changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                activeCompany={activeCompany}
            />
        </>
    )
}