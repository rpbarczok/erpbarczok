import { ResourcesAdd } from './ResourcesAdd.js'
import { apiClient } from '../../utils/openAPIClientAxios.js'
import { DataWithMeta } from '../Pages.jsx'
import { ListGroup, Row } from 'react-bootstrap'
import { LoadingContext } from '../../utils/loadingContext.js'
import { Note, Notes } from '../notifiers/Notes.js'
import { PermissionContext, updateUserPermissions } from '../../utils/permissionContext.js'
import { Resource, ResourceCollection } from './resourceList.js'
import { ResourcesList } from './ResourcesList.js'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'
import { useNotifier } from '../notifiers/useNotifier.js'

interface ResourcePageComponent {
    resource: Resource
    resourceList: DataWithMeta<ResourceCollection>[]
    setIsResourceChanged: React.Dispatch<React.SetStateAction<boolean>>
}

export const ResourcePage = ({ resource, resourceList, setIsResourceChanged }: ResourcePageComponent) => {
    const [mainNotes, addMainNote, removeMainNote] = useNotifier()
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const auth = useAuth()
    const token = auth.user?.access_token
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)

    async function submitNewResource(newItem: DataWithMeta<ResourceCollection>): Promise<Note> {
        const auth = useAuth()
        const token = auth.user?.access_token
        if (token) {
            setIsLoading(true)
            try {
                const client = await apiClient
                const result = await client.paths[resource.paths.all].post(null, newItem.data, { headers: { Authorization: `Bearer ${token}` } })
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

    async function submitChangedResource(changedItem: DataWithMeta<ResourceCollection>): Promise<Note> {
        if (token) {
            setIsLoading(true)
            try {
                const client = await apiClient
                const result = await client.paths[resource.paths.single].put(
                    { id: changedItem.meta.location, 'if-match': changedItem.meta.etag },
                    changedItem.data,
                    { headers: { Authorization: `Bearer ${token}` } })
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

    async function deleteResource(item: DataWithMeta<ResourceCollection>): Promise<Note> {
        if (token) {

            setIsLoading(true)
            try {
                const client = await apiClient
                const result = await client.paths[resource.paths.single].delete(item.meta.location, null, { headers: { Authorization: `Bearer ${token}` } })
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

    const listResources = resourceList.map(item => {
        return <ResourcesList
            key={item.data.name + String(item.meta.location)}
            resource={resource}
            addMainNote={addMainNote}
            submitChangedResource={submitChangedResource}
            deleteResource={deleteResource}
            item={item} />
    })


    return (
        <>
            <Row>
                <h1>{resource.name}</h1>
            </Row>
            <Row>
                <ResourcesAdd
                    resource={resource}
                    addMainNote={addMainNote}
                    submitNewResource={submitNewResource}
                />
            </Row>
            <Notes notes={mainNotes} removeNote={removeMainNote} />
            <Row>
                <ListGroup key={resource.name + '-list'} >
                    {listResources}
                </ListGroup >
            </Row>
        </>
    )
}

