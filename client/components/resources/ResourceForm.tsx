import { AddResources } from './ResourceAdd.jsx'
import { apiClient } from '../../utils/openAPIClientAxios.js'
import { CompanyType } from './companyTypes/CompanyTypesInput.jsx'
import { DataWithMeta } from '../forms.js'
import { Field } from './fields/Fields.jsx'
import { ListGroup, Row } from 'react-bootstrap'
import { LoadingContext } from '../../utils/loadingContext.js'
import { Notes } from '../notifiers/Notes.jsx'
import { PermissionContext, updateUserPermissions } from '../../utils/permissionContext.js'
import { removeStringBeforeLastDigits } from '../../utils/removeStringBeforeLastDigits.js'
import { Resource } from './resourceList.js'
import { ResourcesList } from './ResourcesList.jsx'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'
import { useEffect, useState } from 'react'
import { useNotifier } from '../notifiers/useNotifier.js'

interface ResourceFormComponent {
    resource: Resource
    isResourceChanged: boolean
    setIsResourceChanged: React.Dispatch<React.SetStateAction<boolean>>
}

export const ResourceForm = ({ resource, isResourceChanged, setIsResourceChanged }: ResourceFormComponent) => {
    const [isItemChanged, setIsItemChanged] = useState(true)
    const [mainNotes, addMainNote, removeMainNote] = useNotifier()
    const [newList, setNewList] = useState<DataWithMeta<CompanyType | Field>[]>([])
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const auth = useAuth()
    const token = auth.user?.access_token
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)

    useEffect(() => {
        if (isItemChanged || isResourceChanged) {
            setIsLoading(true)

            async function getResource() {
                const client = await apiClient
                client.paths[resource.paths['all']].get(null, null, { headers: { Authorization: `Bearer ${token}` } })
                    .then(
                        result => {
                            setIsLoading(false)
                            const newList = result?.data.map(row => {
                                const newRow: DataWithMeta<CompanyType | Field> = {
                                    meta: {
                                        location: Number(removeStringBeforeLastDigits(row.meta.location)),
                                        etag: row.meta.etag
                                    },
                                    data: row.data
                                }
                                return newRow
                            })
                            setNewList(newList)
                            updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                        },
                        error => {
                            setIsLoading(false)
                            throw new Error(`Error while loading resource: ${error.message}`)
                        }
                    )
            }
            getResource()
            if (isItemChanged === true) {
                setIsItemChanged(false)
            }
            if (isResourceChanged === true) {
                setIsResourceChanged(false)
            }
        }
    }, [isItemChanged, isResourceChanged])

    const ListResources = newList.map(item => {
        return <ResourcesList
            key={item.data.name + String(item.meta.location)}
            resource={resource}
            setIsItemChanged={setIsItemChanged}
            addMainNote={addMainNote}
            item={item} />
    })


    return (
        <>
            <Row>
                <h1>{resource.name}</h1>
            </Row>
            <Row>
                <AddResources
                    resource={resource}
                    addMainNote={addMainNote}
                    setIsItemChanged={setIsItemChanged}
                />
            </Row>
            <Notes notes={mainNotes} removeNote={removeMainNote} />
            <Row>
                <ListGroup className='standardDesign' key={resource.name + '-list'} >
                    {ListResources}
                </ListGroup >
            </Row>
        </>
    )
}

