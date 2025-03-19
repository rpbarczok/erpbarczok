import React, { useEffect, useState } from "react"
import { Resource } from "./resourceList.js"
import { Button, Form, ListGroup, Modal, Row } from "react-bootstrap"
import { Notes } from "components/notifiers/notifiers.jsx"
import { useNotifier } from "components/notifiers/useNotifier.js"
import { client } from "utils/openAPIClientAxios.js"
import { removeBeforeLastDigits } from "utils/removeBeforeLastDigits.js"
import { DataWithMeta } from "components/forms.jsx"
import { CompanyType } from "./companyTypes/companyTypes.jsx"
import { Field } from "./fields/fields.jsx"
import { ListItem } from "./list.resources.jsx"
import { useAuth } from "react-oidc-context"
import { AddResources } from "./add.resources.jsx"
import { PermissionContext, updateUserPermissions } from "utils/permissionContext.js"
import { useContextThrowUndefined } from "utils/contextUndefined.js"
import { LoadingContext } from "utils/loadingContext.js"

interface MainResourcesComponent {
    resource: Resource
    isResourceChanged: boolean
    setIsResourceChanged: React.Dispatch<React.SetStateAction<boolean>>
}

export const MainResources = ({ resource, isResourceChanged, setIsResourceChanged }: MainResourcesComponent) => {
    const [isItemChanged, setIsItemChanged] = useState(true)
    const [mainNotes, addMainNote, removeMainNote] = useNotifier()
    const [newList, setNewList] = useState<DataWithMeta<CompanyType | Field>[]>([])
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)
    const auth = useAuth()
    const token = auth.user?.access_token
    const { isLoading, setIsLoading } = useContextThrowUndefined(LoadingContext)

    useEffect(() => {
        if (isItemChanged || isResourceChanged) {
            setIsLoading(true)
            client.paths[resource.paths['all']].get(null, null, { headers: { Authorization: `Bearer ${token}` } })
                .then(
                    result => {
                        setIsLoading(false)
                        const newList = result?.data.map(row => {
                            const newRow: DataWithMeta<CompanyType | Field> = {
                                meta: {
                                    location: Number(removeBeforeLastDigits(row.meta.location)),
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
            if (isItemChanged === true) {
                setIsItemChanged(false)
            }
            if (isResourceChanged === true) {
                setIsResourceChanged(false)
            }
        }
    }, [isItemChanged, isResourceChanged])

    const ListResources = newList.map(item => {
        return <ListItem
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
                <ListGroup className="standardDesign" key={resource.name + "-list"} >
                    {ListResources}
                </ListGroup >
            </Row>
        </>
    )
}

