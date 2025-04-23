import { Company } from './CompanyPageBasis.js'
import { CompanySMPage } from './companiesSM/CompanySMPage.js'
import { CompanyType } from '../resources/companyTypes/CompanyTypesInput.js'
import { CompanyXSPage } from './companiesXS/CompanyXSPage.js'
import { DataWithMeta } from '../Pages.jsx'
import { Row } from 'react-bootstrap'
import { FunctionComponent, useState } from 'react'
import { ChangedCompanyAction } from './utils/changedCompanyReducer.js'
import { useFilteredCompanyList } from './utils/useFilteredCompanies.js'
import { useActiveCompany } from './utils/useActiveCompany.js'
import { Note } from 'components/notifiers/Notes.js'
import { useAuth } from 'react-oidc-context'
import { apiClient } from 'utils/openAPIClientAxios.js'
import { LoadingContext } from 'utils/loadingContext.js'
import { useContextThrowUndefined } from 'utils/contextUndefined.js'
import { PermissionContext, updateUserPermissions } from 'utils/permissionContext.js'
import { removeStringBeforeLastDigits } from 'utils/removeStringBeforeLastDigits.js'


interface CompanyPageExtendedProps {
    companiesList: DataWithMeta<Company>[]
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    companyTypesList: DataWithMeta<CompanyType>[]
    changedCompany: DataWithMeta<Company>
    changedCompanyDispatch: React.ActionDispatch<[action: ChangedCompanyAction]>
}

export const CompanyPageExtended: FunctionComponent<CompanyPageExtendedProps> = (
    { companiesList,
        companyTypesList,
        setIsCompanyChanged,
        changedCompany, changedCompanyDispatch }) => {

    const [search, setSearch] = useState<string>('') // Content of the search input fiel
    const [activeCompany, changeActive] = useActiveCompany(changedCompanyDispatch)
    const [filteredCompaniesList, setIsNew] = useFilteredCompanyList(search, companiesList, activeCompany, changeActive)
    const auth = useAuth()
    const token = auth.user?.access_token
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)

    async function submitChangedCompany(): Promise<Note> {
        if (token) {
            setIsLoading(true)
            try {
                const client = await apiClient
                const result = await client.putCompanyById({ id: changedCompany.meta.location, 'if-match': changedCompany.meta.etag },
                    changedCompany.data,
                    { headers: { Authorization: `Bearer ${token}` } })
                setIsLoading(false)

                setIsCompanyChanged(true)
                await changeActive(changedCompany.meta.location)

                if (typeof result.headers.permissions === 'string') {
                    updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                } else {
                    throw new Error("Permission header must be type 'string'")
                }

                return {
                    variant: 'success',
                    message: `Unternehmen erfolgreich überarbeitet.`,
                }
            } catch (error) {
                setIsLoading(false)
                return {
                    variant: 'danger',
                    message: `Fehler beim Speichern der Unternehmensdaten: ${error instanceof Error ? error.message : String(error)}`,
                }

            }

        } else {
            return {
                variant: 'danger',
                message: `Nicht angemeldet.`,
            }
        }
    }

    async function submitNewCompany(): Promise<Note> {
        if (token) {
            setIsLoading(true)
            try {
                const client = await apiClient
                const result = await client.postCompany(null, changedCompany.data, { headers: { Authorization: `Bearer ${token}` } })
                setIsLoading(false)
                if (typeof result.headers.location === 'string') {
                    await changeActive(Number(removeStringBeforeLastDigits(result.headers.location)))
                } else {
                    throw new Error("Permission header must be type 'string'")
                }
                if (typeof result.headers.permissions === 'string') {
                    updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                } else {
                    throw new Error("Permission header must be type 'string'")
                }
                setIsCompanyChanged(true)
                setIsNew(true)
                return {
                    message: `Neues Unternehmen erfolgreich erstellt.`,
                    variant: 'success',
                }
            }
            catch (error) {
                setIsLoading(false)
                return {
                    variant: 'danger',
                    message: `Fehler bei Erstellung des neuen Unternehmens: ${error instanceof Error ? error.message : String(error)}`,
                }

            }
        } else {
            return {
                variant: 'danger',
                message: `Nicht angemeldet.`,
            }
        }
    }

    async function deleteCompany(): Promise<Note | undefined> {
        if (token) {
            const userConfirmed = window.confirm(`Willst du das Unternehmen '${activeCompany.data.name}' wirklich löschen?`)
            if (userConfirmed) {
                setIsLoading(true)
                try {
                    const client = await apiClient
                    const result = await client.deleteCompanyById(activeCompany.meta.location, null, { headers: { Authorization: `Bearer ${token}` } })
                    setIsLoading(false)
                    setIsCompanyChanged(true)
                    if (typeof result.headers.permissions === 'string') {
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                    } else {
                        throw new Error("Permission header must be type 'string'")
                    }
                    return {
                        variant: 'warning',
                        message: `Unternehmen wurde gelöscht.`,
                    }
                } catch (error) {
                    setIsLoading(false)
                    return {
                        variant: 'danger',
                        message: `Löschen der Unternehmen hat nicht geklappt: ${error instanceof Error ? error.message : String(error)}`,
                    }
                }
            }
        } else {
            return {
                variant: 'danger',
                message: `Bitte authentifizieren.`,
            }
        }
    }

    return (
        <>
            <Row className='d-none d-sm-flex flex-grow-1 flex-column' style={{ overflowY: 'scroll' }}>
                <CompanySMPage
                    search={search} setSearch={setSearch}
                    filteredCompaniesList={filteredCompaniesList}
                    activeCompany={activeCompany}
                    changeActive={changeActive}
                    companyTypesList={companyTypesList}
                    changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                    submitChangedCompany={submitChangedCompany} submitNewCompany={submitNewCompany} deleteCompany={deleteCompany}
                />
            </Row>
            <Row className='d-sm-none flex-grow-1 d-flex flex-column' style={{ overflowY: 'hidden' }}>
                <CompanyXSPage
                    search={search} setSearch={setSearch}
                    filteredCompaniesList={filteredCompaniesList}
                    activeCompany={activeCompany}
                    changeActive={changeActive}
                    companyTypesList={companyTypesList}
                    changedCompany={changedCompany} changedCompanyDispatch={changedCompanyDispatch}
                    submitChangedCompany={submitChangedCompany} submitNewCompany={submitNewCompany} deleteCompany={deleteCompany}
                />
            </Row >
        </>
    )
}