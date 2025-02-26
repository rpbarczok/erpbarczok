import {apiSpec} from './server/typescript/openapi.js'
import path from 'node:path'
import fs from 'node:fs'
import {openapiSpecAssembler} from './server/typescript/utils/apiSpecAssembler.js'

const writeOpenApiSpec = async () => {
    openapiSpecAssembler()
    
    const target = path.join(import.meta.dirname, 'client/utils/openapi.ts')
    const content = `
    import {Document} from 'openapi-client-axios'
    export const openapiSpec: Document = ${JSON.stringify(apiSpec,null, 4)}
    `
    fs.writeFile(target, content, err => {
        if (err) {
            console.log(err)
        } else {
            console.log('OpenapiSpec-File for client successfully created')
        }
    })

    const targetJSON = path.join(import.meta.dirname, 'client/utils/openapi.json')
    fs.writeFile(targetJSON, JSON.stringify(apiSpec,null, 4), err => {
        if (err) {
            console.log(err)
        } else {
            console.log('OpenapiSpec-Json-File for client successfully created')
        }
    })
}

await openapiSpecAssembler()