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
import { Notes } from '../../notifiers/Notes.js'
import { PermissionContext } from '../../../utils/permissionContext.js'
import { useContextThrowUndefined } from '../../../utils/contextUndefined.js'
import { useNotifier } from '../../notifiers/useNotifier.js'
import { FunctionComponent } from 'react'

interface CompaniesSMPageProps {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    filteredCompanies: DataWithMeta<Company>[]
    activeCompany: DataWithMeta<Company>
    changeActive: (active: number) => void
    companyTypesList: DataWithMeta<CompanyType>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    setIsNew: React.Dispatch<React.SetStateAction<boolean>>
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
}

export const CompanySMPage: FunctionComponent<CompaniesSMPageProps> = ({ search,
    setSearch,
    filteredCompanies,
    activeCompany,
    changeActive,
    companyTypesList,
    setIsCompanyChanged,
    setIsNew,
    changedCompany,
    changedCompanyDispatch }) => {

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
                        filteredCompanies={filteredCompanies}
                        activeCompany={activeCompany} changeActive={changeActive}
                    />
                </Col>
                <Col className='d-none d-md-block' md={3}>
                    {hasPermission(['user'], permissions)
                        ?
                        <ButtonGroup vertical style={{ padding: '10px 0 0' }}>
                            <CompanyAdd
                                changeActive={changeActive}
                                addEditNote={addEditNote}
                                setIsNew={setIsNew}
                                setIsCompanyChanged={setIsCompanyChanged}
                                companyTypesList={companyTypesList}
                            />
                            <CompanyDelete
                                company={activeCompany}
                                setIsCompanyChanged={setIsCompanyChanged}
                                addNote={addEditNote}
                            />
                        </ButtonGroup >
                        :
                        ''}
                </Col>
            </Row >
            <hr />
            {filteredCompanies.length === 0
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
                        />
                    </Row>
                </>
            }
        </div>
    )
}
