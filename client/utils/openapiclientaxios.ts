import {OpenAPIClientAxios} from 'openapi-client-axios'
import {Client} from "../../server/typescript/types/openapi.js"

const api = new OpenAPIClientAxios({ definition: '/api-docs/'})


export const client = await api.init<Client>()
