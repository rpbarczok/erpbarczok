import { useAuth } from "react-oidc-context"


export const hasScope = (role: string) => {
    const auth = useAuth()
    if (auth.user?.scope) {
        if (auth.user?.scope.indexOf(role) === -1 || auth.user?.scope.indexOf(`api://erpbarczok/${role}`) === -1) {
            return false
        } else {
            return true
        }
    }
    return true
}