import express, { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors, { CorsOptions } from 'cors'
import { apiSpec } from "./openapi.js"
import swaggerUi from 'swagger-ui-express'
import OpenApiValidator from 'express-openapi-validator'
import { baseLogger } from './logger.js'
import { loadControllers } from './utils/apiSpecAssembler.js'
import { sequelize } from './models/index.js'
import path from 'path'
import { jwtCheck } from './utils/auth.js'
import { Request as JWTRequest } from 'express-jwt'
import jsesc from 'jsesc'

export interface Meta {
    location: string
    etag: string
}

export interface DataWithMeta<T> {
    meta: Meta
    data: T
}

const startApp = async () => {
    const app = express()
    const initSequelize = sequelize
    const logger = baseLogger.extend('app')
    const morganLogger = baseLogger.extend('morgan')
    const controllers = await loadControllers()
    logger("All controllers:", controllers)

    app.use(morgan('dev', { stream: { write: msg => { morganLogger(msg); return true } } }))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())

    // handle CORS

    const corsOptions: CorsOptions = { "origin": false, exposedHeaders: ["location", "if-match", "etag", 'Authorization'] }
    if (process.env.NODE_ENV != 'production') {
        corsOptions.origin = [
            "http://localhost:3000"
        ]
    }

    app.use(cors(corsOptions))

    // static content

    app.use(express.static(path.join(import.meta.dirname, '..', 'public')))

    // mitteilen, wo das OAS-Document ist

    app.use('/api-docs', (req, res, next) => { res.json(apiSpec) })

    if (!process.env.CLIENT_ID
        || !process.env.IDP_SERVER
        || !process.env.REDIRECT_URI
        || !process.env.AUDIENCE
    ) {
        console.log('Konfigurationsangaben zu Authentifizierung (CLIENT_ID, IDP_SERVER, REDIRECT_URI, AUDIENCE) unvollständig')
        process.exit(1)
    }

    app.get('/config.js', (req, res, next) => {
        res
            .set("content-type", "text/javascript; charset=utf-8")
            .send(`
window.client_id = '${jsesc(process.env.CLIENT_ID)}';
window.idp_server = '${jsesc(process.env.IDP_SERVER)}';
window.redirect_uri = '${jsesc(process.env.REDIRECT_URI)}';
window.audience = '${jsesc(process.env.AUDIENCE)}';
window.scope = '${jsesc(process.env.SCOPE)}';
`
            )
    }
    )

    // Swagger UI an der Stelle /docs einrichten

    app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(
            undefined,
            {
                swaggerOptions: {
                    // https://github.com/swagger-api/swagger-ui/blob/HEAD/docs/usage/configuration.md
                    url: '/api-docs',
                    oauth: {
                        // https://github.com/swagger-api/swagger-ui/blob/HEAD/docs/usage/oauth2.md
                        clientId: process.env.CLIENT_ID_SWAGGER,
                        appName: 'Panda2 Swagger',
                        additionalQueryStringParams: { audience: process.env.AUDIENCE },
                        scopes: process.env.SCOPE?.split(" ") || ['openid', 'email'],
                        usePkceWithAuthorizationCodeGrant: true
                    }
                }
            }
        )
    )

    // Authentication

    app.use(jwtCheck)

    // validate API calls
    app.use(
        OpenApiValidator.middleware({
            apiSpec,
            validateResponses: true,
            operationHandlers: {
                basePath: "",
                resolver: (basePath, apiRoute) => {
                    const apiPath = apiRoute.openApiRoute.substring(apiRoute.basePath.length)
                    const apiVerb = apiRoute.method
                    const operationHandler = controllers[apiPath][apiVerb]
                    logger(`apiPath: ${apiPath}, apiVerb: ${apiVerb}`)
                    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
                        try {
                            return await operationHandler(req, res, next)
                        } catch (err: any) {
                            next(err)
                        }

                    }
                }
            },
            validateSecurity: {
                handlers: {
                    openId: (req: JWTRequest, requiredScopesArray, schema) => {
                        const name = process.env.SCOPE_CLAIM || 'scope'
                        const userScope: string | string[] | unknown = req.auth ? req.auth[name] : []
                        const userScopeArray: string[] | unknown = typeof userScope === 'string' ? userScope.split(" ") : userScope

                        if (requiredScopesArray.length === 0) {
                            console.log("No scope required. Authorized.")
                            return true
                        }

                        if (!Array.isArray(userScopeArray)) {
                            console.log("Scope has the wrong type. Authorization rejected.")
                            return false
                        }

                        if (userScopeArray.length === 0) {
                            console.log("No scopes provided, but scopes required: ", requiredScopesArray)
                            return false
                        }

                        if (userScopeArray.some((e) => requiredScopesArray.includes(e))) {
                            return true
                        }

                        console.log("User has not the required scopes: User scopes: " + userScopeArray + ", Required Scopes: " + requiredScopesArray)
                        return false
                    }
                }
            }
        }
        )
    )


    // add API error handler
    app.set("json spaces", 2)
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        const status = err.status || 500
        logger("Error %o.", err)
        if (process.env.NODE_ENV === 'production' && status === 500) {
            res.status(status).json({
                status,
                message: "Internal Server Error",
                errors: []
            })
            return
        }

        res.status(status).json({
            status,
            message: err.message,
            errors: err.errors
        })
    })

    return app
}

export const startingApp = startApp()