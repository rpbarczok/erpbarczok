import { AxiosResponse } from "openapi-client-axios"
import { Components, Paths } from "types/openapi.js"

const isAxiosResponse = (value: unknown): value is AxiosResponse<unknown> => {
    return (
        typeof value === 'object' &&
        value !== null &&
        'status' in value &&
        'data' in value
    )
}


export const is$200GetCompanyTypes = (value: unknown): value is AxiosResponse<Paths.GetCompanyTypes.Responses.$200> => {
    if (isAxiosResponse(value)) {
        if (value.data && value.status ) {
            if (Array.isArray(value.data)) {
                return value.status === 200
            }
        }

    }
    return false
}

export const is$201 = (value: unknown): value is AxiosResponse<Components.Responses.$201> => {
    if (isAxiosResponse(value)) {
        return value.status === 201;
    }
    return false
}

export const is$204Success = (value: unknown): value is AxiosResponse<Components.Responses.$204Success> => {
    if (isAxiosResponse(value)) {
        return value.status === 204;
    }
    return false
}

export const is$204Updated = (value: unknown): value is AxiosResponse<Components.Responses.$204Updated> => {
    if (isAxiosResponse(value)) {
        return value.status === 204
    }
    return false
}

export const isSchemasError = (value: unknown): value is AxiosResponse<Components.Schemas.Error> => {
    if (isAxiosResponse(value)) {
        const data = value.data 

        if (typeof data === 'object' && data !== null && 'message' in data)
        return (value.status !== 200 && value.status !== 201 && value.status !== 204)
    }
    return false
}