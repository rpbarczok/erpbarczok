import React, { createContext } from "react"
import { useContextThrowUndefined } from "./contextUndefined.js"

export interface PermissionContextInterface {
    permissions: string[],
    setPermissions: React.Dispatch<React.SetStateAction<string[]>>
}

export const PermissionContext = createContext<PermissionContextInterface | undefined>(undefined)


export const updateUserPermissions = (
    userPermissions: string | undefined,
    permissions: string[],
    setPermissions: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (userPermissions) {
        const permissionsHeadersArray: string[] = userPermissions.split(' ')
        if (permissionsHeadersArray !== permissions) setPermissions(permissionsHeadersArray)
    } else {
        throw new Error('No Permission Header found')
    }
}