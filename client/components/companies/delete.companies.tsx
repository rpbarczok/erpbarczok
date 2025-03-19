import { client } from "utils/openAPIClientAxios.js"
import { Company } from "./companies.js"
import { DataWithMeta } from "components/forms.js"
import { Note } from "components/notifiers/notifiers.js"
import React from "react"
import { Button } from "react-bootstrap"
import { useAuth } from "react-oidc-context"
import { useContextThrowUndefined } from "utils/contextUndefined.js"
import { PermissionContext, updateUserPermissions } from "utils/permissionContext.js"
import { LoadingContext } from "utils/loadingContext.js"

interface DeleteCompanyComponent {
    company: DataWithMeta<Company>
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    addNote: (note: Note) => void
    setShow?: React.Dispatch<React.SetStateAction<boolean>>
    size?: "sm" | "lg"
}

export const DeleteCompanies = ({ company, setIsCompanyChanged, addNote, setShow, size }: DeleteCompanyComponent) => {
    const auth = useAuth()
    const token = auth.user?.access_token
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const { isLoading, setIsLoading } = useContextThrowUndefined(LoadingContext)

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const userConfirmed = window.confirm(`Willst du das Unternehmen '${company.data.name}' wirklich löschen?`)
        if (userConfirmed) {
            setIsLoading(true)
            client.deleteCompanyById(company.meta.location, null, { headers: { Authorization: `Bearer ${token}` } })
                .then(
                    result => {
                    setIsLoading(false)
                    setIsCompanyChanged(true)
                    const note: Note = {
                        variant: 'warning',
                        message: `Unternehmen wurde gelöscht.`,
                    }
                    if (setShow) {
                        setShow(false)
                    }
                    addNote(note)
                    updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                },
                error => {
                    setIsLoading(false)
                    const note: Note = {
                        variant: 'danger',
                        message: `Löschen der Unternehmen hat nicht geklappt: ${error.message}`,
                    }
                    addNote(note)
                }
            )
        }
    }
    return <Button size={size} className="standardDesign" variant="outline-danger" onClick={handleDelete}>Löschen</Button>
}
