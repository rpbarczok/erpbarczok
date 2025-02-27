import path from 'node:path'
import { baseLogger } from "../logger.js"
import { apiSpec as apiSpecBase } from '../openapi.js'
import type { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types.js'
import { Request, Response, RequestHandler, NextFunction } from 'express'

export interface Operation {
    (req: Request, res: Response, next: NextFunction): Promise<void>
    apiSpec: OpenAPIV3.OperationObject
}

interface PathMap {
    [path: string]: VerbMap
}

interface VerbMap {
    [verb: string]: Operation
}


const logger = baseLogger.extend("apiSpecAssembler")


export const getControllerFiles = async () => {
    const apiPaths = apiSpecBase.paths
    const controllerFiles: PathMap = {}
    logger('Importing controllers')
    for (const apiPath in apiPaths) {
        controllerFiles[apiPath] = {}
        const controllerPath = apiPath.slice(-1) === '/' ?
            path.join(import.meta.dirname, '..', 'controllers', apiPath, 'index.js') :
            path.join(import.meta.dirname, '..', 'controllers', apiPath) + '.js'

        controllerFiles[apiPath] = await import(controllerPath)
    }
    logger('Controllers imported')
    return controllerFiles
}

export const openapiSpecAssembler = async (controllerFiles: PathMap) => {
    logger('Assembling OpenAPI spec')
    for (const controllerPath in controllerFiles) {
        for (const controllerItem in controllerFiles[controllerPath]) {
            if (controllerItem === "apiSpec") {
                Object.assign(apiSpecBase.paths[controllerItem], controllerFiles[controllerItem])
            }
            if (["GET", "PUT", "POST", "DELETE"].includes(controllerItem)) {
                const apiVerbMin = controllerItem.toLocaleLowerCase() as "get" | "put" | "post" | "delete"
                apiSpecBase.paths[controllerPath][apiVerbMin] = controllerFiles[controllerPath][controllerItem].apiSpec
            }
        }
    }
}

export const loadControllers = async () => {
    const controllerFiles = await getControllerFiles()
    await openapiSpecAssembler(controllerFiles)


    const controllers: PathMap = {}
    for (const apiPath in apiSpecBase.paths) {
        controllers[apiPath] = {}
        for (const apiVerb in apiSpecBase.paths[apiPath]) {
            const apiVerbCap = apiVerb.toUpperCase()
            if (["GET", "POST", "PUT", "DELETE"].includes(apiVerbCap)) {
                const operation: Operation = controllerFiles[apiPath][apiVerbCap]
                if (operation) controllers[apiPath][apiVerbCap] = operation
            }
        }

    }
    return controllers
}
