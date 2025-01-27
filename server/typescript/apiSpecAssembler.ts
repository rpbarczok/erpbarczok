import path from 'node:path'
import baseLogger from "./logger.js"
import { apiSpec as apiSpecBase } from './openapi.cjs'
import type { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types.js'
import { Request, Response, RequestHandler } from 'express'

export interface Operation {
    (req: Request, res: Response): Promise<void>
    apiSpec: OpenAPIV3.OperationObject
}

interface PathMap {
    [x: string]: VerbMap
}

interface VerbMap {
    [x: string]: RequestHandler
}

const logger = baseLogger.extend("apiSpecAssembler")

const apiPaths = apiSpecBase.paths

async function loadControllers() {
    const controllers: PathMap = {}
    for (const apiPath in apiPaths) {
        controllers[apiPath] = {}
        const pathLogger = logger.extend(apiPath)
        pathLogger("starting import of ", apiPath)

        const controllerPath = apiPath.slice(-1) === '/' ?
            path.join(import.meta.dirname, 'controllers', apiPath, 'index.js') :
            path.join(import.meta.dirname, 'controllers', apiPath) + '.js'

        logger(`Loading controller ${controllerPath} for API path ${apiPath}`)

        const controller = await import(controllerPath)

        pathLogger("successfully imported module.")

        if (controller.apiSpec as OpenAPIV3.PathItemObject) {
            Object.assign(apiSpecBase.paths[apiPath], controller.apiSpec)
            pathLogger("Added generic api spec:", apiSpecBase.paths[apiPath])
        }

        for (const apiVerbCap of ["GET", "PUT", "POST", "DELETE"]) {
            const operation = controller[apiVerbCap]
            if (operation && operation.apiSpec) {
                const apiVerbMin = apiVerbCap.toLowerCase() as "get" | "put" | "post" | "delete"
                apiSpecBase.paths[apiPath][apiVerbMin] = operation.apiSpec
                const handler: RequestHandler = controller[apiVerbCap]
                controllers[apiPath][apiVerbCap] = handler
            }
        }
    }
    return (controllers)
}

const controllers = await loadControllers()

export default controllers