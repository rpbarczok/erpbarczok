import express, { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors, { CorsOptions } from 'cors'
import { apiSpec } from "./openapi.js"
import swaggerUi from 'swagger-ui-express'
import OpenApiValidator, { middleware } from 'express-openapi-validator'
import { baseLogger } from './logger.js'
import { apiControllers } from './apiSpecAssembler.js'
import { sequelize } from './models/index.js'
import path from 'path'
import { jwtCheck } from './utils/auth.js'
import { Request as JWTRequest } from 'express-jwt'

export interface MetaEtag {
    location: string
    etag: string
}

export interface Meta<T> {
    meta: MetaEtag
    data: T
}

const startApp = async () => {
    const app = express()

    const logger = baseLogger.extend('app')
    const morganLogger = baseLogger.extend('morgan')
    const controllers = apiControllers
    logger("All controllers:", controllers)
    const initSequelize = sequelize

    app.use(morgan('dev', { stream: { write: msg => { morganLogger(msg); return true } } }))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())

    // handle CORS

    const corsOptions: CorsOptions = { "origin": false, exposedHeaders: ["location", "if-match", "etag", 'Authorization'] }
    if (process.env.NODE_ENV != 'production') {
        corsOptions.origin = [
            "http://localhost:3000",
            "http://localhost:8080"
        ]
    }

    app.use(cors(corsOptions))

    // static content

    app.use(express.static(path.join(import.meta.dirname, '..', 'public')))


    // mitteilen, wo das OAS-Document ist

    app.use('/api-docs', (req, res, next) => { res.json(apiSpec) })

    // Swagger UI an der Stelle /docs einrichten

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: `/api-docs`
        }
    }))

    // Authorication

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
                    logger(`apiPath: ${apiPath}, apiVerb: ${apiVerb}, OperationHandler: ${operationHandler}`)
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
                    OAuth2: (req: JWTRequest, scopes) => {
                        if (scopes.length === 0) return true
                        if (!req.auth?.scope) return false
                        if ((req.auth.scope as string).split(" ").some((e) => scopes.includes(e))) return true
                        console.log("User has not the required scopes: User scopes: " + req.auth.scope + ", Required Scopes: " + scopes)
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