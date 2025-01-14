import { apiSpec } from "./openapi.cjs";
import path from 'path';
import baseLogger from "./logger.js";
const logger = baseLogger.extend('resolver');
export default async function loadControllers() {
    const controllers = {};
    for (const [apiPath, apiVerbs] of Object.entries(apiSpec.paths)) {
        controllers[apiPath] = {};
        for (const [apiVerb, declaration] of Object.entries(apiVerbs)) {
            if (apiVerb !== 'parameters') {
                controllers[apiPath][apiVerb.toUpperCase()] = await findController(apiPath, apiVerb);
            }
        }
    }
    logger("Controllers: ", controllers);
    return controllers;
}
async function findController(apiPath, apiVerb) {
    const controllerPath = apiPath.slice(-1) === '/' ?
        path.join(import.meta.dirname, 'controllers', apiPath, 'index.js') :
        path.join(import.meta.dirname, 'controllers', apiPath) + '.js';
    logger(`Loading controller ${controllerPath} for API path ${apiPath}`);
    const controller = await import(controllerPath);
    const operationHandler = controller[apiVerb.toUpperCase()];
    // sanity check
    if (operationHandler === undefined) {
        throw new Error(`Could not find a [${apiVerb}] function in ${controllerPath} when trying to route [${apiVerb} ${apiPath}].`);
    }
    return operationHandler;
}
