import path from 'node:path'
import { baseLogger } from '../logger.js'
import { apiSpec as apiSpecBase } from '../openapi.js'
import type { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types.js'
import { Request, Response, NextFunction } from 'express'
import { ErrorWithStatus } from '../services/error.js'

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


const logger = baseLogger.extend('apiSpecAssembler')

const isVerbMap = (value: unknown): value is VerbMap => {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    for (const key in value) {
        if (['GET', 'PUT', 'POST', 'DELETE'].includes(key)) {
            for (const val in value[key]) {
                if (val === 'apiSpec') {
                    return true
                }
            }
        }
    }
    return false
}

export const getControllerFiles = async () => {
    const apiPaths = apiSpecBase.paths
    const controllerFiles: PathMap = {}
    logger('Importing controllers')
    for (const apiPath in apiPaths) {
        logger('Importing controller from path ', apiPath)
        controllerFiles[apiPath] = {}
        const controllerPath = apiPath.endsWith('/') ?
            path.join(import.meta.dirname, '..', 'controllers', apiPath, 'index.js') :
            path.join(import.meta.dirname, '..', 'controllers', apiPath) + '.js'
        const result: unknown = await import(controllerPath)
        // Use the type guard to check if the result is a VerbMap
        if (isVerbMap(result)) {
            controllerFiles[apiPath] = result
        } else {
            logger(`Controller at path ${controllerPath} does not match VerbMap interface.`)
            throw ErrorWithStatus(500, 'Invalid controller format at path: ' + controllerPath)
        }
    }
    logger('Controllers imported')
    return controllerFiles
}

export const openapiSpecAssembler = (controllerFiles: PathMap) => {
    logger('Assembling OpenAPI spec')
    for (const controllerPath in controllerFiles) {
        for (const controllerItem in controllerFiles[controllerPath]) {
            if (controllerItem === 'apiSpec') {
                Object.assign(apiSpecBase.paths[controllerItem], controllerFiles[controllerItem])
            }
            if (['GET', 'PUT', 'POST', 'DELETE'].includes(controllerItem)) {
                const apiVerbMin = controllerItem.toLocaleLowerCase() as 'get' | 'put' | 'post' | 'delete'
                apiSpecBase.paths[controllerPath][apiVerbMin] = controllerFiles[controllerPath][controllerItem].apiSpec
            }
        }
    }
}

export const loadControllers = async () => {
    const controllerFiles = await getControllerFiles()

    openapiSpecAssembler(controllerFiles)


    const controllers: PathMap = {}
    for (const apiPath in apiSpecBase.paths) {
        controllers[apiPath] = {}
        for (const apiVerb in apiSpecBase.paths[apiPath]) {
            const apiVerbCap = apiVerb.toUpperCase()
            if (['GET', 'POST', 'PUT', 'DELETE'].includes(apiVerbCap)) {
                const operation: Operation = controllerFiles[apiPath][apiVerbCap]
                controllers[apiPath][apiVerbCap] = operation
            }
        }
    }
    return controllers
}
