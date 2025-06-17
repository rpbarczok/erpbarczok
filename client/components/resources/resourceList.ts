
import { DataWithMeta } from '../Pages.jsx'
import { Country } from './countries/CountriesInput.js'


export interface Paths {
    all: string
    single: string
}
export interface ResourceDescription<T> {
    name: string
    paths: Paths
    empty: DataWithMeta<T>
}

export interface ResourcePayloadAndDescription<T> {
    description: ResourceDescription<T>
    item: DataWithMeta<T>
}

export interface GenericResource {
    'name': string
}

export type Resource = GenericResource | Country

export function isGenericResource(obj: unknown): obj is GenericResource {
    if (typeof obj !== 'object' || obj === null) {
        return false
    }
    if (Object.keys(obj).length === 1) {
        if (Object.keys(obj).includes('name')) {
            return true
        }
    }
    return false
}


export function isResourceDescription(obj: unknown): obj is ResourceDescription<Resource> {
    if (typeof obj !== 'object' || obj === null) {
        return false
    }
    if (Object.keys(obj).length === 3) {
        if (Object.keys(obj).includes('paths') && Object.keys(obj).includes('empty')) return true
    }
    return false
}
