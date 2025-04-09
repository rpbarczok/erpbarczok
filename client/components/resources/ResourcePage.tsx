import { AddResources } from './ResourceAdd.js'
import { apiClient } from '../../utils/openAPIClientAxios.js'
import { CompanyType } from './companyTypes/CompanyTypesInput.js'
import { DataWithMeta } from '../Pages.jsx'
import { Field } from './fields/Fields.js'
import { ListGroup, Row } from 'react-bootstrap'
import { LoadingContext } from '../../utils/loadingContext.js'
import { Notes } from '../notifiers/Notes.js'
import { PermissionContext, updateUserPermissions } from '../../utils/permissionContext.js'
import { removeStringBeforeLastDigits } from '../../utils/removeStringBeforeLastDigits.js'
import { Resource } from './resourceList.js'
import { ResourcesList } from './ResourcesList.js'
import { useAuth } from 'react-oidc-context'
import { useContextThrowUndefined } from '../../utils/contextUndefined.js'
import { useEffect, useState } from 'react'
import { useNotifier } from '../notifiers/useNotifier.js'

interface ResourcePageComponent {
    resource: Resource
    isResourceChanged: boolean
    setIsResourceChanged: React.Dispatch<React.SetStateAction<boolean>>
}

export const ResourcePage = ({ resource, isResourceChanged, setIsResourceChanged }: ResourcePageComponent) => {
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
                if (token) {
                    try {
                        const client = await apiClient
                        const result = await client.paths[resource.paths.all].get(null, null, { headers: { Authorization: `Bearer ${token}` } })
                        setIsLoading(false)
                            const newList = result.data.map(row => {
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
                            if (typeof result.headers.permissions === 'string') {
                                updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                            } else {
                                throw Error('Permissions header should be type string.')
                            }    
                    } catch (error) {
                        setIsLoading(false)
                        throw Error(`Error while loading resource: ${error instanceof Error ? error.message : String(error)}`)
                    }
                } else {
                    throw Error('Bitte authentifizieren')
                }
            }

            void getResource()
            
            if (isItemChanged) {
                setIsItemChanged(false)
            }
            if (isResourceChanged) {
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
                <ListGroup  key={resource.name + '-list'} >
                    {ListResources}
                </ListGroup >
            </Row>
        </>
    )
}

