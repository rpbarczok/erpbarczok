import { OpenAPIClientAxios, Document } from 'openapi-client-axios'
import { type Client } from '../types/openapi.js'
import { openapiSpec } from './openapi.js'

const api = new OpenAPIClientAxios({ definition: openapiSpec as Document })

export const apiClient = api.init<Client>()


