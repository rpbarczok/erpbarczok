import {OpenAPIClientAxios} from 'openapi-client-axios'
import {Client} from "../types/openapi.d.js"
import path from 'node:path'

const api = new OpenAPIClientAxios({ definition: path.join(import.meta.dirname, 'client', 'public', 'openapi.json')})


export const client = await api.init<Client>()
