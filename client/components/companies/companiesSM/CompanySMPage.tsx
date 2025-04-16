import { ButtonGroup, Col, Row } from 'react-bootstrap'
import { ChangedCompanyAction } from '../utils/changedCompanyReducer.js'
import { CompaniesSMList } from './CompaniesSMList.js'
import { Company } from '../CompanyPageBasis.js'
import { CompanyAdd } from '../CompanyAdd.js'
import { CompanyDelete } from '../CompanyDelete.js'
import { CompanySMEdit } from './CompanySMEdit.js'
import { CompanySMSearch } from './CompanySMSearch.js'
import { CompanyType } from '../../resources/companyTypes/CompanyTypesInput.js'
import { DataWithMeta } from '../../Pages.js'
import { hasPermission } from '../../../utils/hasPermission.js'
import { Heading } from '../../headings/Heading.js'
import { Note, Notes } from '../../notifiers/Notes.js'
import { PermissionContext } from '../../../utils/permissionContext.js'
import { useContextThrowUndefined } from '../../../utils/contextUndefined.js'
import { useNotifier } from '../../notifiers/useNotifier.js'
import { FunctionComponent } from 'react'

interface CompaniesSMPageProps {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    filteredCompaniesList: DataWithMeta<Company>[]
    activeCompany: DataWithMeta<Company>
    changeActive: (active: number) => Promise<void>
    companyTypesList: DataWithMeta<CompanyType>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
    submitChangedCompany: () => Promise<Note>
    submitNewCompany: () => Promise<Note>
    deleteCompany: () => Promise<Note | undefined>
}

export const CompanySMPage: FunctionComponent<CompaniesSMPageProps> = ({ search,
    setSearch,
    filteredCompaniesList,
    activeCompany,
    changeActive,
    companyTypesList,
    setIsCompanyChanged,
    changedCompany,
    changedCompanyDispatch,
    submitChangedCompany,
    submitNewCompany,
    deleteCompany
}) => {

    const [editNotes, addEditNote, removeEditNote] = useNotifier()
    const { permissions } = useContextThrowUndefined(PermissionContext)

    return (
        <div className='flex-grow-1' >
            <Heading title='Stammdaten: Kunden, Lieferanten, Spediteure' cssClass='stamm' />
            <Row >
                <Col sm={5} md={4}>
                    <CompanySMSearch search={search} setSearch={setSearch} />
                </Col>
                <Col sm={7} md={5}>
                    <CompaniesSMList
                        filteredCompaniesList={filteredCompaniesList}
                        activeCompany={activeCompany} changeActive={changeActive}
                    />
                </Col>
                <Col className='d-none d-md-block' md={3}>
                    {hasPermission(['user'], permissions)
                        ?
                        <ButtonGroup vertical style={{ padding: '10px 0 0' }}>
                            <CompanyAdd
                                addEditNote={addEditNote}
                                companyTypesList={companyTypesList}
                                submitNewCompany={submitNewCompany}
                            />
                            <CompanyDelete
                                addNote={addEditNote}
                                deleteCompany={deleteCompany}
                            />
                        </ButtonGroup >
                        :
                        ''}
                </Col>
            </Row >
            <Row>
                <Col className='d-none d-sm-flex d-md-none'>
                    {hasPermission(['user'], permissions)
                        ?
                        <ButtonGroup className='flex-grow-1' style={{ padding: '10px 0 0' }}>
                            <CompanyAdd
                                addEditNote={addEditNote}
                                companyTypesList={companyTypesList}
                                submitNewCompany={submitNewCompany}
                            />
                            <CompanyDelete
                                addNote={addEditNote}
                                deleteCompany={deleteCompany}
                            />
                        </ButtonGroup >
                        :
                        ''}
                </Col>
            </Row>
            <hr />
            {filteredCompaniesList.length === 0
                ? <p>Kein Unternehmen gefunden!</p>
                : <>
                    <Notes notes={editNotes} removeNote={removeEditNote} ></Notes>
                    <Row>
                        <CompanySMEdit
                            key={activeCompany.meta.location}
                            company={activeCompany}
                            companyTypesList={companyTypesList}
                            setIsCompanyChanged={setIsCompanyChanged}
                            addEditNote={addEditNote}
                            changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                            changeActive={changeActive}
                            submitChangedCompany={submitChangedCompany}
                        />
                    </Row>
                </>
            }
        </div>
    )
}
