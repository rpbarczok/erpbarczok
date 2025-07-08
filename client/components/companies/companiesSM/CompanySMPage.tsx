import { ButtonGroup, Col, Row } from 'react-bootstrap'
import { ChangedCompanyAction } from '../utils/changedCompanyReducer.js'
import { CompaniesSMList } from './CompaniesSMList.js'
import { Company } from '../CompanyPage.js'
import { CompanyAdd } from '../CompanyAdd.js'
import { CompanyDelete } from '../CompanyDelete.js'
import { CompanySMEdit } from './CompanySMEdit.js'
import { CompanySMSearch } from './CompanySMSearch.js'
import { DataWithMeta } from '../../Pages.js'
import { hasPermission } from '../../../utils/hasPermission.js'
import { Heading } from '../../headings/Heading.js'
import { Note, Notes } from '../../notifiers/Notes.js'
import { PermissionContext } from '../../../utils/permissionContext.js'
import { useContextThrowUndefined } from '../../../utils/contextUndefined.js'
import { useNotifier } from '../../notifiers/useNotifier.js'
import { FunctionComponent } from 'react'
import { GenericResource } from 'components/resources/resourceList.js'

interface CompaniesSMPageProps {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    filteredCompaniesList: DataWithMeta<Company>[]
    activeCompany: DataWithMeta<Company>
    changeActive: (active: number) => Promise<void>
    companyTypesList: DataWithMeta<GenericResource>[]
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
    submitChangedCompany: (changedCompany: DataWithMeta<Company>) => Promise<Note>,
    submitNewCompany:(newCompany: DataWithMeta<Company>) => Promise<Note>
    deleteCompany: () => Promise<Note | undefined>
}

export const CompanySMPage: FunctionComponent<CompaniesSMPageProps> = ({ search,
    setSearch,
    filteredCompaniesList,
    activeCompany,
    changeActive,
    companyTypesList,
    changedCompany,
    changedCompanyDispatch,
    submitChangedCompany,
    submitNewCompany,
    deleteCompany
}) => {

    const [editNotes, addEditNote, removeEditNote] = useNotifier()
    const { permissions } = useContextThrowUndefined<{ permissions: string[] }>(PermissionContext)

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
                            activeCompany={activeCompany}
                            companyTypesList={companyTypesList}
                            addEditNote={addEditNote}
                            changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                            submitChangedCompany={submitChangedCompany}
                        />
                    </Row>
                </>
            }
        </div>
    )
}
