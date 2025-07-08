import { Button } from 'react-bootstrap'
import { Note } from '../notifiers/Notes.js'
import { Resource, ResourceDescription, ResourcePayloadAndDescription } from './resourceList.js'
import { FunctionComponent, useState } from 'react'
import { apiClient } from 'utils/openAPIClientAxios.js'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from 'utils/contextUndefined.js'
import { LoadingContext } from 'utils/loadingContext.js'
import { PermissionContext, updateUserPermissions } from 'utils/permissionContext.js'
import { Country, isCountryDescription } from './countries/CountriesInput.js'
import { isAddressTypeDescription } from './addressTypes/AddressTypesInput.js'
import { isCompanyTypeDescription } from './companyTypes/CompanyTypesInput.js'
import { isFieldDescription } from './fields/Fields.js'
import { ResourcesAddModal } from './ResourcesAddModal.js'

interface ResourcesAddProps {
    resource: ResourceDescription<Resource>
    addMainNote: (note: Note) => void
    setIsResourceChanged: React.Dispatch<React.SetStateAction<boolean>>
}

export const ResourcesAdd: FunctionComponent<ResourcesAddProps> = ({ resource, addMainNote, setIsResourceChanged }) => {
    const [show, setShow] = useState(false)
    const [addItemCount, setAddItemCount] = useState(0)
    const auth = useAuth()
    const token = auth.user?.access_token
    const { setIsLoading } = useContextThrowUndefined<{ setIsLoading: (isLoading: boolean) => void }>(LoadingContext)
    const { permissions, setPermissions } = useContextThrowUndefined<{ permissions: string[]; setPermissions: (permissions: string[]) => void }>(PermissionContext)

    const handleModal = () => {
        setAddItemCount(addItemCount + 1)
        setShow(true)
    }

    async function submitNewResource({ description, item }: ResourcePayloadAndDescription<Resource>): Promise<Note> {

        if (token) {
            setIsLoading(true)
            try {
                const client = await apiClient
                const result = isCountryDescription(description)
                    ? await client.paths[description.paths.all].post(null, item.data as Country, { headers: { Authorization: `Bearer ${token}` } })
                    : isAddressTypeDescription(description)
                        ? await client.paths[description.paths.all].post(null, item.data, { headers: { Authorization: `Bearer ${token}` } })
                        : isCompanyTypeDescription(description)
                            ? await client.paths[description.paths.all].post(null, item.data, { headers: { Authorization: `Bearer ${token}` } })
                            : isFieldDescription(description)
                                ? await client.paths[description.paths.all].post(null, item.data, { headers: { Authorization: `Bearer ${token}` } })
                                : undefined
                if (result === undefined) {
                    throw new Error('Entität nicht gefunden, bitte Entwickler kontaktieren.')
                }
                // const result = await client.paths[resource.paths.all].post(null, newItem.data, { headers: { Authorization: `Bearer ${token}` } })
                setIsLoading(false)

                setIsResourceChanged(true)
                if (typeof result.headers.permissions === 'string') {
                    updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                } else {
                    throw new Error("Permission header must be type 'string'")
                }
                return {
                    message: `Eine neue Entität wurde erfolgreich abgespeichert.`,
                    variant: 'success'
                }

            } catch (error) {
                setIsLoading(false)
                return {
                    message: `Fehler beim Speichern der neuen Entität:  ${error instanceof Error ? error.message : String(error)}`,
                    variant: 'danger',
                }
            }

        } else {
            return {
                message: `Bitte anmelden`,
                variant: 'danger',
            }
        }

    }

    return (<>
        <Button variant='outline-primary' onClick={handleModal}>{resource.name} hinzufügen</Button>
        <ResourcesAddModal
            key={'newItem' + String(addItemCount)}
            show={show} setShow={setShow}
            resource={resource}
            submitNewResource={submitNewResource}
            addMainNote={addMainNote}
        />
    </>
    )
}

