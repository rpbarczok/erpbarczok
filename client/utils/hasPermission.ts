export const hasPermission = (roles: string[], permissions: string[]): boolean =>  {
    for (const role of roles) {
        if (permissions.some(element => element === role)) return true
    }
    return false
}