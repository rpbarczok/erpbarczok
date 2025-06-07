
import { DataWithMeta } from "components/Pages.js";
import { Company } from "../CompanyPage.js";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useContextThrowUndefined } from "utils/contextUndefined.js";
import { LoadingContext } from "utils/loadingContext.js";
import { PermissionContext, updateUserPermissions } from "utils/permissionContext.js";
import { apiClient } from "utils/openAPIClientAxios.js";
import { removeStringBeforeLastDigits } from "utils/removeStringBeforeLastDigits.js";
import { Note } from "components/notifiers/Notes.js";
import { useFilteredCompanyList } from "./useFilteredCompanies.js";

export function useCompanies(search: string, activeCompany: DataWithMeta<Company>, changeActive: (active?: number) => Promise<void>):
    [
        DataWithMeta<Company>[],
        (changedCompany: DataWithMeta<Company>) => Promise<Note>,
        (newCompany: DataWithMeta<Company>) => Promise<Note>,
        () => Promise<Note | undefined>,
    ] {
    const auth = useAuth()
    const token = auth.user?.access_token
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)
    const [companiesList, setCompaniesList] = useState<DataWithMeta<Company>[]>([])
    const [isCompanyChanged, setIsCompanyChanged] = useState<boolean>(true)
    const [filteredCompaniesList, setIsNew] = useFilteredCompanyList(search, companiesList, activeCompany, changeActive)

    useEffect(() => {
        if (isCompanyChanged) {
            setIsLoading(true)

            async function getCompanies() {
                if (token) {
                    try {
                        const client = await apiClient
                        const result = await client.getCompanies(null, null, { headers: { 'Authorization': `Bearer ${token}` } })
                        setIsLoading(false)
                        const newList = result.data.map(row => {
                            const newRow: DataWithMeta<Company> = {
                                meta: {
                                    location: Number(removeStringBeforeLastDigits(row.meta.location)),
                                    etag: row.meta.etag
                                },
                                data: row.data
                            }
                            return (newRow)
                        })
                        setCompaniesList(newList)
                        if (typeof result.headers.permissions === 'string') {
                            updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                        } else {
                            throw new Error("Permission header must be type 'string'")
                        }
                    } catch (error) {
                        setIsLoading(false)
                        throw Error(`Error while loading companies: ${error instanceof Error ? error.message : String(error)}`)
                    }
                }

            }

            void getCompanies()

            setIsCompanyChanged(false)
        }
    }, [isCompanyChanged])

    async function submitChangedCompany(changedCompany: DataWithMeta<Company>): Promise<Note> {
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

    async function submitNewCompany(newCompany: DataWithMeta<Company>): Promise<Note> {
        if (token) {
            setIsLoading(true)
            try {
                const client = await apiClient
                const result = await client.postCompany(null, newCompany.data, { headers: { Authorization: `Bearer ${token}` } })
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

    return [
        filteredCompaniesList,
        submitChangedCompany,
        submitNewCompany,
        deleteCompany
    ]
}