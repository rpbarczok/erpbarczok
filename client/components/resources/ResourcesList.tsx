import { ListGroup } from 'react-bootstrap'
import { Note } from '../notifiers/Notes.jsx'
import { GenericResource, Resource, ResourceDescription, ResourcePayloadAndDescription } from './resourceList.js'
import { useState } from 'react'
import { useContextThrowUndefined } from 'utils/contextUndefined.js'
import { LoadingContext } from 'utils/loadingContext.js'
import { useAuth } from 'react-oidc-context'
import { apiClient } from 'utils/openAPIClientAxios.js'
import { Country, isCountryDescription } from './countries/CountriesInput.js'
import { isAddressTypeDescription } from './addressTypes/AddressTypesInput.js'
import { isCompanyTypeDescription } from './companyTypes/CompanyTypesInput.js'
import { isFieldDescription } from './fields/Fields.js'
import { PermissionContext, updateUserPermissions } from 'utils/permissionContext.js'
import { ResourceModelEdit } from './ResourceModelEdit.js'

interface ResourcesListProps {

    addMainNote: (note: Note) => void
    resource: ResourceDescription<Resource>
    setIsResourceChanged: React.Dispatch<React.SetStateAction<boolean>>
    resourceList: ResourcePayloadAndDescription<Resource>[]
}

export const ResourcesList = ({ resource, addMainNote, setIsResourceChanged, resourceList }: ResourcesListProps) => {
    const [show, setShow] = useState(false)
    const { setIsLoading } = useContextThrowUndefined<{ setIsLoading: (isLoading: boolean) => void }>(LoadingContext)
    const auth = useAuth()
    const token = auth.user?.access_token
    const { permissions, setPermissions } = useContextThrowUndefined<{ permissions: string[]; setPermissions: (permissions: string[]) => void }>(PermissionContext)
    const [item, setItem] = useState<ResourcePayloadAndDescription<Resource>>({description: resource, item: resource.empty})


    const handleModal = (e: React.MouseEvent, element: ResourcePayloadAndDescription<Resource>) => {
        e.preventDefault()
        setItem(element)
        setShow(true)
    }


    async function submitChangedResource({ description, item }: ResourcePayloadAndDescription<Resource>): Promise<Note> {
        if (token) {
            setIsLoading(true)
            try {
                const client = await apiClient
                const result = isCountryDescription(description)
                    ? await client.paths[description.paths.single].put({ id: item.meta.location, 'if-match': item.meta.etag }, item.data as Country, { headers: { Authorization: `Bearer ${token}` } })
                    : isAddressTypeDescription(description)
                        ? await client.paths[description.paths.single].put({ id: item.meta.location, 'if-match': item.meta.etag }, item.data as GenericResource, { headers: { Authorization: `Bearer ${token}` } })
                        : isCompanyTypeDescription(description)
                            ? await client.paths[description.paths.single].put({ id: item.meta.location, 'if-match': item.meta.etag }, item.data as GenericResource, { headers: { Authorization: `Bearer ${token}` } })
                            : isFieldDescription(description)
                                ? await client.paths[description.paths.single].put({ id: item.meta.location, 'if-match': item.meta.etag }, item.data as GenericResource, { headers: { Authorization: `Bearer ${token}` } })
                                : undefined
                if (result === undefined) {
                    throw new Error('Entität nicht gefunden, bitte Entwickler kontaktieren.')
                }
                setIsLoading(false)
                setIsResourceChanged(true)
                if (typeof result.headers.permissions === 'string') {
                    updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                } else {
                    throw new Error("Permission header must be type 'string'")
                }
                return {
                    message: `Die Entität wurde erfolgreich geändert.`,
                    variant: 'success'
                }
            } catch (error) {
                setIsLoading(false)
                return {
                    message: `Fehler beim Ändern der Entität:  ${error instanceof Error ? error.message : String(error)}`,
                    variant: 'danger'
                }
            }
        } else {
            return {
                message: 'Nicht authentifiziert',
                variant: 'danger'
            }
        }
    }

    async function deleteResource({ description, item }: ResourcePayloadAndDescription<Resource>): Promise<Note> {
        if (token) {

            setIsLoading(true)
            try {
                const client = await apiClient
                const result = isCountryDescription(description)
                    ? await client.paths[description.paths.single].delete(item.meta.location, null, { headers: { Authorization: `Bearer ${token}` } })
                    : isAddressTypeDescription(description)
                        ? await client.paths[description.paths.single].delete(item.meta.location, null, { headers: { Authorization: `Bearer ${token}` } })
                        : isCompanyTypeDescription(description)
                            ? await client.paths[description.paths.single].delete(item.meta.location, null, { headers: { Authorization: `Bearer ${token}` } })
                            : isFieldDescription(description)
                                ? await client.paths[description.paths.single].delete(item.meta.location, null, { headers: { Authorization: `Bearer ${token}` } })
                                : undefined
                if (result === undefined) {
                    throw new Error('Entität nicht gefunden, bitte Entwickler kontaktieren.')
                }
                setIsLoading(false)
                setIsResourceChanged(true)
                if (typeof result.headers.permissions === 'string') {
                    updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                } else {
                    throw new Error("Permission header must be type 'string'")
                }
                return {
                    variant: 'warning',
                    message: `${resource.name} wurde gelöscht.`,
                }
            } catch (error) {
                setIsLoading(false)
                return {
                    variant: 'danger',
                    message: `Löschen der ${resource.name} hat nicht geklappt: ${error instanceof Error ? error.message : String(error)}`,
                }
            }


        } else {
            return {
                message: 'Nicht authentifiziert',
                variant: 'danger'
            }

        }
    }

    return (
        <>
            {resourceList.map(element => {
                return (
                    <ListGroup.Item key={element.item.data.name} onClick={(e) => handleModal(e, element)}>
                        {element.item.data.name}
                    </ListGroup.Item>
                )
            })
            }
            < ResourceModelEdit
                key={item.item.meta.etag}
                show={show} setShow={setShow}
                addMainNote={addMainNote}
                deleteResource={deleteResource}
                submitChangedResource={submitChangedResource}
                item = {item}
            />
        </>
    )
}

