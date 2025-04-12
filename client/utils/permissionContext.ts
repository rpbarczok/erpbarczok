import { createContext } from 'react'

export interface PermissionContextProps {
    permissions: string[],
    setPermissions: React.Dispatch<React.SetStateAction<string[]>>
}

export const PermissionContext = createContext<PermissionContextProps | undefined>(undefined)


export const updateUserPermissions = (
    userPermissions: string | undefined,
    permissions: string[],
    setPermissions: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (userPermissions) {
        const permissionsHeadersArray: string[] = userPermissions.split(' ')
        if (permissionsHeadersArray !== permissions) setPermissions(permissionsHeadersArray)
    } else {
        throw Error('Permissions header should be type string.')
    }
}