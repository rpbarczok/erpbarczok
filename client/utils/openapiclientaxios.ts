import {OpenAPIClientAxios, Document} from 'openapi-client-axios'
import {Client} from "../types/openapi.d.js"
import {openapiSpec} from './openapi.js'

const api = new OpenAPIClientAxios({ definition: openapiSpec as Document})

export const client = await api.init<Client>()
