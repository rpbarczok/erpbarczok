import {apiSpec} from './server/typescript/openapi.js'
import path from 'node:path'
import fs from 'node:fs'

const openapiSpecAssembler = async () => {
    const apiPaths = apiSpec.paths
    for (const apiPath in apiPaths) {
        const controllerPath = apiPath.slice(-1) === '/' ?
            path.join(import.meta.dirname, 'server/typescript/controllers', apiPath, 'index.ts') :
            path.join(import.meta.dirname, 'server/typescript/controllers', apiPath) + '.ts'
        const controller = await import(controllerPath)

        if (controller.apiSpec) {
            Object.assign(apiSpec.paths[apiPath], controller.apiSpec)
        }

        for (const apiVerbCap of ["GET", "PUT", "POST", "DELETE"]) {
            const operation = controller[apiVerbCap]

            if (operation && operation.apiSpec) {
                const apiVerbMin = apiVerbCap.toLowerCase()
                apiSpec.paths[apiPath][apiVerbMin] = operation.apiSpec
            }
        }
    }

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