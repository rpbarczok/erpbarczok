import { apiClient } from '../../utils/openAPIClientAxios.js'
import { Button } from 'react-bootstrap'
import { Company } from './CompanyPageBasis.jsx'
import { DataWithMeta } from '../Pages.jsx'
import { LoadingContext } from '../../utils/loadingContext.js'
import { Note } from '../notifiers/Notes.jsx'
import { PermissionContext, updateUserPermissions } from '../../utils/permissionContext.js'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'

interface CompanyDeleteInterface {
    company: DataWithMeta<Company>
    setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
    addNote: (note: Note) => void
    setShow?: React.Dispatch<React.SetStateAction<boolean>>
    size?: 'sm' | 'lg'
}

export const CompanyDelete = ({ company, setIsCompanyChanged, addNote, setShow, size }: CompanyDeleteInterface) => {
    const auth = useAuth()
    const token = auth.user?.access_token
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (token) {
            const userConfirmed = window.confirm(`Willst du das Unternehmen '${company.data.name}' wirklich löschen?`)
            if (userConfirmed) {
                setIsLoading(true)
                try {
                    const client = await apiClient
                    const result = await client.deleteCompanyById(company.meta.location, null, { headers: { Authorization: `Bearer ${token}` } })
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
                    if (typeof result.headers.permissions === 'string') {
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                    } else {
                        throw Error('Permissions header should be type string.')
                    }
                } catch (error) {
                    setIsLoading(false)
                    const note: Note = {
                        variant: 'danger',
                        message: `Löschen der Unternehmen hat nicht geklappt: ${error instanceof Error ? error.message : String(error)}`,
                    }
                    addNote(note)
                }
            }
        } else {
            throw Error('Bitte authentifizieren')
        }
    }
    return <Button size={size}  variant='outline-danger' onClick={handleDelete}>Löschen</Button>
}
