/*
Copyright (c) 2024, 2025 Ralph Barczok
Portions Copyright (c) 2024 Joachim Keltsch
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


import cookieParser from 'cookie-parser'
import cors, { CorsOptions } from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { Request as JWTRequest } from 'express-jwt'
import OpenApiValidator from 'express-openapi-validator'
import jsesc from 'jsesc'
import morgan from 'morgan'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import { baseLogger } from './logger.js'
import { sequelize } from './models/index.js'
import { apiSpec } from './openapi.js'
import { loadControllers, Operation } from './utils/apiSpecAssembler.js'
import { jwtCheck } from './utils/auth.js'
import { setDefaultValues } from './models/default-values.js'
import { ApiErrorLike } from './controllers/controllersError.js'

export interface Meta {
    location: string
    etag: string
}

export interface DataWithMeta<T> {
    meta: Meta
    data: T
}

interface PermissionRequest extends JWTRequest {
    userPermissions?: string[]
}

const startApp = async () => {
    const app = express()
    const logger = baseLogger.extend('app')
    const database = sequelize
    const morganLogger = baseLogger.extend('morgan')
    const permissionLogger = logger.extend('permission')
    const controllers = await loadControllers()
    logger('All controllers:', controllers)

    app.use(morgan('dev', { stream: { write: msg => { morganLogger(msg); return true } } }))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())

    // handle CORS

    const corsOptions: CorsOptions = { 'origin': false, exposedHeaders: ['location', 'etag', 'Permissions'] }
    if (process.env.NODE_ENV != 'production') {
        corsOptions.origin = [
            'http://localhost:3000'
        ]
    }

    app.use(cors(corsOptions))

    // static content

    app.use(express.static(path.join(import.meta.dirname, '..', 'public')))


    // initialize Database

    try {
        await database.sync({ alter: true })
        logger('Drop and re-sync db.')
    } catch (error: unknown) {
        logger('Failed to sync db: ', error)
        throw error
    }

    try {
        await setDefaultValues()
    } catch (error: unknown) {
        logger('Failed to set default values: ', error)
    }

    // mitteilen, wo das OAS-Document ist

    app.use('/api-docs', (req, res) => { res.json(apiSpec) })

    if (!process.env.CLIENT_ID
        || !process.env.IDP_SERVER
        || !process.env.AUDIENCE
    ) {
        logger('Konfigurationsangaben zu Authentifizierung (CLIENT_ID, IDP_SERVER, AUDIENCE) unvollständig')
        process.exit(1)
    }

    app.get('/config.js', (req, res) => {
        res
            .set('content-type', 'text/javascript; charset=utf-8')
            .send(`
window.client_id = '${jsesc(process.env.CLIENT_ID)}';
window.idp_server = '${jsesc(process.env.IDP_SERVER)}';
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
                        clientId: process.env.CLIENT_ID_SWAGGER ?? process.env.CLIENT_ID,
                        appName: 'ERPBarczok Swagger',
                        additionalQueryStringParams: { audience: process.env.AUDIENCE },
                        scopes: process.env.SCOPE?.split(' ') ?? ['openid', 'email', 'profile', 'admin', 'user'],
                        usePkceWithAuthorizationCodeGrant: true
                    }
                }
            }
        )
    )

    // Authentication

    app.use(jwtCheck)

    app.use((req: PermissionRequest, res, next) => {
        const isArrayOfStrings = (array: unknown): array is string[] => {
            if (Array.isArray(userPermissionsPrep)) {
                return userPermissionsArray.every(value => typeof value === 'string')
            }
            return false
        }
        const name: string = process.env.PERMISSION_CLAIM ?? 'roles'
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return , @typescript-eslint/no-unsafe-member-access
        const userPermissionsPrep: unknown = name.split('.').reduce((o, k) => o?.o[k], req.auth)
        const userPermissionsArray: string[] = []
        if (isArrayOfStrings(userPermissionsPrep)) {
            userPermissionsArray.push(...userPermissionsPrep)
        } else if (typeof userPermissionsPrep === 'string') {
            userPermissionsArray.push(...userPermissionsPrep.split(' '))
        }
        const userPermissions = ['public']
        if (userPermissionsArray.some(permission => permission === 'user')) userPermissions.push('user')
        if (userPermissionsArray.some(permission => permission === 'admin')) userPermissions.push('admin', 'user')

        req.userPermissions = userPermissions

        res.set('permissions', req.userPermissions.join(' '))

        permissionLogger('Permissions: ', req.userPermissions.join(' '))
        next()
    })

    // validate API calls
    app.use(
        OpenApiValidator.middleware({
            apiSpec,
            validateResponses: true,
            operationHandlers: {
                basePath: '',
                resolver: (basePath, apiRoute) => {
                    const apiPath = apiRoute.openApiRoute.substring(apiRoute.basePath.length)
                    const apiVerb = apiRoute.method
                    const operationHandler: Operation = controllers[apiPath][apiVerb]
                    logger(`apiPath: ${apiPath}, apiVerb: ${apiVerb}`)
                    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
                        try {
                            await operationHandler(req, res, next)
                        } catch (error: unknown) {
                            next(error)
                        }

                    }
                }
            },
            validateSecurity: {
                handlers: {
                    openId: (req: PermissionRequest, requiredScopesArray) => {
                        if (requiredScopesArray.length === 0) {
                            permissionLogger('No scope required. Authorized.')
                            return true
                        }

                        if (!Array.isArray(req.userPermissions)) {
                            permissionLogger('Scope has the wrong type. Authorization rejected.')
                            return false
                        }

                        if (req.userPermissions.length === 0) {
                            permissionLogger('No scopes provided, but scopes required: ', requiredScopesArray)
                            return false
                        }

                        if (req.userPermissions.some((e) => requiredScopesArray.includes(e))) {
                            permissionLogger('Permission granted.')
                            return true
                        }

                        permissionLogger('User has not the required scopes: User scopes: ', req.userPermissions, ', Required Scopes: ', requiredScopesArray)
                        return false
                    }
                }
            }
        }
        )
    )


    // add API error handler
    app.set('json spaces', 2)
    app.use(
        (error: Partial<ApiErrorLike>, req: Request, res: Response, _next: NextFunction) => {
            logger('Error %o.', error)
            if (error.status) {
                res.status(error.status)
                    .json({
                        status: error.status,
                        message: error.message,
                        errors: error.errors
                    })
            } else {

                const message = process.env.NODE_ENV === "production"
                    ? "internal error"
                    : error instanceof Error ? error.message : JSON.stringify(error)

                res.status(500)
                    .json({
                        status: 500,
                        message,
                        errors: []
                    })
            }

        })

    return app
}

export const startingApp = startApp()