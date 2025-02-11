import {OpenAPIClientAxios} from 'openapi-client-axios'
import {Client} from "../types/openapi.d.js"

const api = new OpenAPIClientAxios({ definition: 'client/public/openapi.json'})


export const client = await api.init<Client>()
