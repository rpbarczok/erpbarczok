import {apiSpec} from './server/typescript/openapi.js'
import path from 'node:path'
import fs from 'node:fs'
import {openapiSpecAssembler, getControllerFiles} from './server/typescript/utils/apiSpecAssembler.js'

const writeOpenApiSpec = async () => {
    const controllerFiles = await getControllerFiles()
    await openapiSpecAssembler(controllerFiles)
    
    const target = path.join(import.meta.dirname, 'client/utils/openapi.ts')
    const content = `
    import {Document} from 'openapi-client-axios'
    export const openapiSpec: Document = ${JSON.stringify(apiSpec,null, 4)}
    `
    fs.writeFile(target, content, error => {
        if (error) {
            console.log(error)
        } else {
            console.log('OpenapiSpec Typescript for client successfully created')            
        }
    })

    const targetJSON = path.join(import.meta.dirname, 'client/utils/openapi.json')
    fs.writeFile(targetJSON, JSON.stringify(apiSpec,null, 4), error => {
        if (error) {
            console.log(error)
        } else {
            console.log('OpenapiSpec Json File for client successfully created')
        }
    })
}

await writeOpenApiSpec()