import React from 'react'
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap'
import { SMSearchCompanies } from './sm.search.companies.jsx'
import { DataWithMeta } from '../../components/forms.jsx'
import { Company } from './companies.jsx'
import { SMListCompanies } from './sm.list.companies.jsx'
import { CompanyType } from '../../components/resources/companyTypes/companyTypes.js'
import { DeleteCompanies } from './delete.companies.jsx'
import { AddCompany } from './add.companies.jsx'
import { SMEditCompanies } from './sm.edit.companies.jsx'
import { ChangedCompanyAction } from './company.reducer.js'
import { Heading } from '../../components/headings/heading.jsx'
import { Notes } from '../../components/notifiers/notifiers.jsx'
import { useNotifier } from '../../components/notifiers/useNotifier.js'
import { hasPermission } from '../../utils/hasPermission.js'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'
import { PermissionContext } from '../../utils/permissionContext.js'

interface CompaniesFormSMComponent {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    filteredCompanies: DataWithMeta<Company>[]
    activeCompany: DataWithMeta<Company>
    handleChangeActive: (active: number) => void
    companyTypesList: DataWithMeta<CompanyType>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    setIsNew: React.Dispatch<React.SetStateAction<boolean>>
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
}

export const SMFormCompanies = ({ search,
    setSearch,
    filteredCompanies,
    activeCompany,
    handleChangeActive,
    companyTypesList,
    setIsCompanyChanged,
    setIsNew,
    changedCompany,
    changedCompanyDispatch }: CompaniesFormSMComponent) => {

    const [editNotes, addEditNote, removeEditNote] = useNotifier()
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)

    const buttonGroupAddDelete = <>
        <AddCompany
            handleChangeActive={handleChangeActive}
            addEditNote={addEditNote}
            setIsNew={setIsNew}
            setIsCompanyChanged={setIsCompanyChanged}
            companyTypesList={companyTypesList}
        />
        <DeleteCompanies
            company={activeCompany}
            setIsCompanyChanged={setIsCompanyChanged}
            addNote={addEditNote}
        />
    </>

    const Edit = () => {
        if (filteredCompanies.length === 0) {
            return (
                <p>Kein Unternehmen gefunden!</p>
            )
        } else {
            return (
                <>
                    <Row className='d-none d-sm-block d-md-none'>
                        {hasPermission(['user'], permissions) ? <ButtonGroup>{buttonGroupAddDelete}</ButtonGroup> : ''}
                    </Row>
                    <Notes notes={editNotes} removeNote={removeEditNote} ></Notes>
                    <Row>
                        <SMEditCompanies
                            key={activeCompany.meta.location}
                            company={activeCompany}
                            companyTypesList={companyTypesList}
                            setIsCompanyChanged={setIsCompanyChanged}
                            addEditNote={addEditNote}
                            changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                        />
                    </Row>
                </>
            )
        }
    }
    return (
        <div className='flex-grow-1' >
            <Heading title='Stammdaten: Kunden, Lieferanten, Spediteure' cssClass='stammForm' />
            <Row >
                <Col sm={5} md={4}>
                    <SMSearchCompanies search={search} setSearch={setSearch} />
                </Col>
                <Col sm={7} md={5}>
                    <SMListCompanies
                        filteredCompanies={filteredCompanies}
                        activeCompany={activeCompany} handleChangeActive={handleChangeActive}
                    />
                </Col>
                <Col className='d-none d-md-block' md={3}>
                {hasPermission(['user'], permissions) ?<ButtonGroup vertical style={{ padding: '10px 0 0' }}>{buttonGroupAddDelete}</ButtonGroup >: '' }
                </Col>
            </Row >
            <hr />
            <Edit />
        </div>
    )
}
