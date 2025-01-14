import path from 'node:path';
import baseLogger from "./logger.js";
import { apiSpec as apiSpecBase } from './openapi.cjs';
const logger = baseLogger.extend("apiSpecAssembler");
const apiPaths = apiSpecBase.paths;
async function loadControllers() {
    const controllers = {};
    for (const apiPath in apiPaths) {
        controllers[apiPath] = {};
        const pathLogger = logger.extend(apiPath);
        pathLogger("starting import of ", apiPath);
        const controllerPath = apiPath.slice(-1) === '/' ?
            path.join(import.meta.dirname, 'controllers', apiPath, 'index.js') :
            path.join(import.meta.dirname, 'controllers', apiPath) + '.js';
        logger(`Loading controller ${controllerPath} for API path ${apiPath}`);
        const controller = await import(controllerPath);
        pathLogger("successfully imported module.");
        if (controller.apiSpec) {
            Object.assign(apiSpecBase.paths[apiPath], controller.apiSpec);
            pathLogger("Added generic api spec:", apiSpecBase.paths[apiPath]);
        }
        for (const apiVerbSpec of [controller.GET, controller.PUT, controller.POST, controller.DELETE]) {
            if (apiVerbSpec && apiVerbSpec.apiSpec) {
                const apiVerb = apiVerbSpec.name.toLowerCase();
                apiSpecBase.paths[apiPath][apiVerb] = apiVerbSpec.apiSpec;
                const handler = controller[apiVerb.toUpperCase()];
                controllers[apiPath][apiVerb.toUpperCase()] = handler;
            }
        }
    }
    return (controllers);
}
const controllers = await loadControllers();
export default controllers;
