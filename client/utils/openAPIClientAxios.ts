import { OpenAPIClientAxios } from 'openapi-client-axios'
import { openapiSpec } from './openapi.js'
import { type Client } from '../types/openapi.js'

const api = new OpenAPIClientAxios({ definition: openapiSpec })

export const apiClient = api.init<Client>()