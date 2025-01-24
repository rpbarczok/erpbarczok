import { getCompanytypeById, deleteCompanytypeById, putCompanytypeById } from '../../services/companytypes.js'
import { error_formatter, NotFoundError } from "../../services/error.js"
import type { Request, Response } from 'express'
import type { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types.js'
import { CompanytypeApi } from './index.js'
import { normalize_companytype } from './index.js'
import { Meta } from '../../app.js'
import { sha256 } from '../../hasher.js'

export const GET = async (req: Request, res: Response) => {
    try {
        const companytype = await getCompanytypeById(Number(req.params.id))
        const companytypeApi: Meta<CompanytypeApi> = normalize_companytype(companytype)
        res.status(200).json(companytypeApi)
    }
    catch (err) {
        if (err instanceof NotFoundError) res.status(404).json({ "status": 404, "message": "not found" })
        else throw err
    }
}
GET.apiSpec = {
    "summary": "Get a certain company type",
    "description": "GET request on a certain company type by id {id}",
    "tags": [
        "Companytype"
    ],
    "responses": {
        "200": {
            "description": "Successfull operation",
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "required": [
                            "meta",
                            "data"
                        ],
                        "additionalProperties": false,
                        "properties": {
                            "meta": {
                                "$ref": "#/components/schemas/meta"
                            },
                            "data": {
                                "$ref": "#/components/schemas/companytype"
                            }
                        }
                    },
                    "examples": {
                        "companytype": {
                            "$ref": "#/components/examples/companytype"
                        }
                    }
                }
            }
        },
        "400": {
            "$ref": "#/components/responses/400-validation-error"
        },
        "404": {
            "$ref": "#/components/responses/404-not-found-error"
        }
    }
}

export const DELETE = async (req: Request, res: Response) => {
    try {
        await deleteCompanytypeById(Number(req.params.id))
        res.status(204).end()
    }
    catch (err) {
        if (err instanceof NotFoundError) res.status(404).json({ status: 404, message: "not found" })
        else throw err
    }
}
DELETE.apiSpec = {
    "summary": "Remove a certain company type",
    "description": "DELETE request on company type by id {id}",
    "tags": [
        "Companytype"
    ],
    "responses": {
        "204": {
            "$ref": "#/components/responses/204-success"
        },
        "400": {
            "$ref": "#/components/responses/400-validation-error"
        },
        "404": {
            "$ref": "#/components/responses/404-not-found-error"
        }
    }
}

export const PUT = async (req: Request, res: Response) => {
    try {
        const dbData= await getCompanytypeById(Number(req.params.id))
        const companytype = normalize_companytype(dbData)
        const dbHash = sha256(JSON.stringify(companytype.data))
        console.log(dbHash)
        console.log(req.body.meta.etag)
        if (dbHash === req.body.meta.etag) {
            try {
                await putCompanytypeById(Number(req.params.id), req.body.data)
                res.status(204).end()
            }
            catch (err) {
                error_formatter(500, err)
            }
        } else {
            res.status(412).json({ status: 412, message: "Precondition failed" })
        }

    }
    catch (err) {
        if (err instanceof NotFoundError) res.status(404).json({ status: 404, message: "not found" })
        else throw err
    }
}
PUT.apiSpec = {
    "summary": "Updates company type with id {id}",
    "description": "Put request on company type by id {id}",
    "tags": [
        "Companytype"
    ],
    "requestBody": {
        "description": "Add company type",
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "required": [
                        "meta",
                        "data"
                    ],
                    "additionalProperties": false,
                    "properties": {
                        "meta": {
                            "$ref": "#/components/schemas/meta"
                        },
                        "data": {
                            "$ref": "#/components/schemas/companytype"
                        }
                    }
                }
            }
        }
    },
    "responses": {
        "204": {
            "$ref": "#/components/responses/204-success"
        },
        "400": {
            "$ref": "#/components/responses/400-validation-error"
        },
        "404": {
            "$ref": "#/components/responses/404-not-found-error"
        },
        "412": {
            "$ref": "#/components/responses/412-precondition-error"
        }
    }
}

export const apiSpec: OpenAPIV3.PathItemObject = {
    "parameters": [
        {
            "$ref": "#/components/parameters/id-in-path"
        }
    ]
}