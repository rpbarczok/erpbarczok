import apiSpecBase from './server/typescript/openapi.json' with { type: 'json' }
import path from 'node:path'
import fs from 'node:fs'

const openapiSpecAssembler = async () => {
    const apiPaths = apiSpecBase.paths
    for (const apiPath in apiPaths) {
        const controllerPath = apiPath.slice(-1) === '/' ?
            path.join(import.meta.dirname, 'server/ecmascript/controllers', apiPath, 'index.js') :
            path.join(import.meta.dirname, 'server/ecmascript/controllers', apiPath) + '.js'
        const controller = await import(controllerPath)

        if (controller.apiSpec) {
            Object.assign(apiSpecBase.paths[apiPath], controller.apiSpec)
        }

        for (const apiVerbCap of ["GET", "PUT", "POST", "DELETE"]) {
            const operation = controller[apiVerbCap]

            if (operation && operation.apiSpec) {
                const apiVerbMin = apiVerbCap.toLowerCase()
                apiSpecBase.paths[apiPath][apiVerbMin] = operation.apiSpec
            }
        }
    }

    const target = path.join(import.meta.dirname, 'client/public/openapi.json')
    fs.writeFile(target, JSON.stringify(apiSpecBase), err => {
        if (err) {
            console.log(err)
        } else {
            console.log('OpenapiSpec-File for client successfully created')
        }
    })
}

await openapiSpecAssembler()