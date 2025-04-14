import { ChangedCompanyAction } from '../utils/changedCompanyReducer.js'
import { Col, Row } from 'react-bootstrap'
import { CompaniesXSList } from './CompaniesXSList.js'
import { Company } from '../CompanyPageBasis.js'
import { CompanyAdd } from '../CompanyAdd.js'
import { CompanyType } from '../../resources/companyTypes/CompanyTypesInput.js'
import { CompanyXSSearch } from './CompanyXSSearch.js'
import { DataWithMeta } from '../../Pages.js'
import { hasPermission } from '../../../utils/hasPermission.js'
import { Heading } from '../../headings/Heading.js'
import { Notes } from '../../notifiers/Notes.js'
import { PermissionContext } from '../../../utils/permissionContext.js'
import { useContextThrowUndefined } from '../../../utils/contextUndefined.js'
import { useNotifier } from '../../notifiers/useNotifier.js'
import { FunctionComponent } from 'react'

interface CompanyXSPageProps {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    filteredCompaniesList: DataWithMeta<Company>[]
    activeCompany: DataWithMeta<Company>
    changeActive: (active: number) => Promise<void>
    companyTypesList: DataWithMeta<CompanyType>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    setIsNew: React.Dispatch<React.SetStateAction<boolean>>
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
}

export const CompanyXSPage: FunctionComponent<CompanyXSPageProps> = ({
    search,
    setSearch,
    filteredCompaniesList,
    activeCompany,
    changeActive,
    companyTypesList,
    setIsCompanyChanged,
    setIsNew,
    changedCompany,
    changedCompanyDispatch }) => {

    const [editNotes, addEditNote, removeEditNote] = useNotifier()
    const {permissions} = useContextThrowUndefined(PermissionContext)

    return (

        <Col className='flex-grow-1 d-flex flex-column' style={{ overflowY: 'hidden' }}>
            <Heading title='Stammdaten: Kunden, Lieferanten, Spediteure' cssClass='stamm' />
            <Row style={{ margin: '10px 3px 0 3px' }}>
                {hasPermission(['user'], permissions) ? <CompanyAdd
                    changeActive={changeActive}
                    addEditNote={addEditNote}
                    setIsNew={setIsNew}
                    companyTypesList={companyTypesList}
                    setIsCompanyChanged={setIsCompanyChanged}
                /> : '' }
            </Row>
            <Notes notes={editNotes} removeNote={removeEditNote}/>
            <CompanyXSSearch search={search} setSearch={setSearch} />
            <CompaniesXSList
                filteredCompaniesList={filteredCompaniesList}
                changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                changeActive={changeActive} activeCompany={activeCompany}
                companyTypesList={companyTypesList}
                setIsCompanyChanged={setIsCompanyChanged}
                addEditNote={addEditNote}
            />
        </Col>
    )
}
