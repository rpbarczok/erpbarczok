import { ChangedCompanyAction } from './changedCompanyReducer.js'
import { Company } from './CompanyFormBasis.jsx'
import { CompanyType } from '../resources/companyTypes/CompanyTypesInput.js'
import { CompanyXSEdit } from './CompanyXSEdit.jsx'
import { DataWithMeta } from '../forms.js'
import { ListGroup} from 'react-bootstrap'
import { Note } from '../notifiers/Notes.jsx'
import { useState } from 'react'

interface CompanyXSListInterface {
    filteredCompanies: DataWithMeta<Company>[]
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
    activeCompany: DataWithMeta<Company>
    changeActive: (active: number) => Promise<void>
    companyTypesList: DataWithMeta<CompanyType>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    addEditNote: (note: Note) => void
}

export const CompaniesXSList = (
    { filteredCompanies, 
        changedCompany, 
        changedCompanyDispatch, 
        activeCompany, 
        companyTypesList, 
        setIsCompanyChanged, 
        changeActive, 
        addEditNote }: CompanyXSListInterface) => {

    const [show, setShow] = useState(false)

    const handleOpenModal = async (e: React.MouseEvent<Element, MouseEvent>, location: number) => {
        e.preventDefault
        await changeActive(location)
        setShow(true)
    }


    const List = () => {

        return filteredCompanies.map((element) => {
            return (
                <ListGroup.Item key={element.meta.location} onClick={(e) => handleOpenModal(e, element.meta.location)}>
                    {element.data.name + (element.data.abbr ? ' (' + element.data.abbr + ')' : '')}
                </ListGroup.Item>
            )
        }
        )
    }



    return (
        <>
            <div className='flex-grow-1 d-flex flex-column' style={{ overflowY: 'hidden', marginTop: '10px' }}>
                <ListGroup key='company-list-xs' id='company-list-xs' style={{ overflowY: 'scroll' }}>
                    {filteredCompanies.length > 0 ? <List /> : <span>Keine Unternehmen gefunden</span>}
                </ListGroup >
                <CompanyXSEdit
                    key={activeCompany.meta.location}
                    show={show} setShow={setShow}
                    companyTypesList={companyTypesList}
                    addEditNote={addEditNote}
                    setIsCompanyChanged={setIsCompanyChanged}
                    changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                    activeCompany={activeCompany}
                />
            </div>
        </>
    )
}