import express, { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors, { CorsOptions } from 'cors'
import { apiSpec } from "./openapi.cjs"
import swaggerUi from 'swagger-ui-express'
import OpenApiValidator from 'express-openapi-validator'
import baseLogger from './logger.js'
import loadControllers from './apiSpecAssembler.js'
import initSequelize from './models/index.js'

const startApp = async () => {
    const app = express()

    const logger = baseLogger.extend('app')
    const morganLogger = baseLogger.extend('morgan')
    const controllers = loadControllers
    logger("All controllers:", controllers)
    const sequelize = initSequelize

    dotenv.config()

    app.use(morgan('dev', { stream: { write: msg => { morganLogger(msg); return true } } }))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())

    // handle CORS

    const corsOptions: CorsOptions = { "origin": false, exposedHeaders: "location" }
    if (process.env.NODE_ENV != 'production') {
        corsOptions.origin = [
            "http://localhost:3000",
            "http://hainan:3000",
            "http://hainan:8080"
        ]
    }

    app.use(cors(corsOptions))

    // mitteilen, wo das OAS-Document ist

    app.use('/api-docs', (req, res, next) => { res.json(apiSpec) })

    // Swagger UI an der Stelle /docs einrichten

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: `/api-docs`
        }
    }))

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
                    return operationHandler
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

const startingApp = startApp()

export default startingApp