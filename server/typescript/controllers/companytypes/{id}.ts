import { getCompanytypeById, deleteCompanytypeById, putCompanytypeById } from '../../services/companytypes.js'
import { error_formatter, NotFoundError } from "../../services/error.js"
import type { Request, Response } from 'express'
import type { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types.js'
import { CompanytypeResponse, normalizeCompanytype, normalizeCompanytypeLocationEtag } from './index.js'
import { Operation } from '../../apiSpecAssembler.js'
import { MetaEtag } from '../../app.js'

export const GET: Operation = async (req: Request, res: Response) => {
    try {
        const companytype = await getCompanytypeById(Number(req.params.id))
        const companytypeResponse: CompanytypeResponse = normalizeCompanytype(companytype)
        const companytypeResponseMeta: MetaEtag = normalizeCompanytypeLocationEtag(companytype)
        res
            .status(200)
            .set(companytypeResponseMeta)
            .json(companytypeResponse)
    }
    catch (err) {
        if (err instanceof NotFoundError) res.status(404).json({ "status": 404, "message": "not found" })
        else throw err
    }
}
GET.apiSpec = {
    "summary": "Get a certain companytype",
    "description": "GET request on a certain companytype by id {id}",
    "tags": [
        "Companytype"
    ],
    "responses": {
        "200": {
            "description": "Successfull operation",
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": "#/components/schemas/companytype"

                    },
                    "examples": {
                        "companytype": {
                            "$ref": "#/components/examples/companytype"
                        }
                    }
                }
            },
            "headers": {
                "location": {
                    "description": "Location of the requested companytype",
                    "schema": {
                        "$ref": "#/components/schemas/location"
                    }
                },
                "etag": {
                    "description": "Etag of the requested companytype",
                    "schema": {
                        "$ref": "#/components/schemas/etag"
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

export const DELETE: Operation = async (req: Request, res: Response) => {
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

export const PUT: Operation = async (req: Request, res: Response) => {
    try {
        const dbCompanytype = await getCompanytypeById(Number(req.params.id))
        const dbCompanytypeMeta = normalizeCompanytypeLocationEtag(dbCompanytype)
        if (dbCompanytypeMeta.etag === req.headers['if-match']) {
            try {
                const updatedCompanytype = await putCompanytypeById(Number(req.params.id), req.body)
                const companytypeHeader = normalizeCompanytypeLocationEtag(updatedCompanytype)
                res
                    .status(204)
                    .set(companytypeHeader)
                    .end()
            }
            catch (err) {
                res
                    .status(500)
                    .json(error_formatter(500, err))
            }
        } else {
            res
                .status(412)
                .json({ status: 412, message: "Precondition failed" })
        }

    }
    catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404)
                .json({ status: 404, message: "not found" })
        } else {
            throw err
        }
    }
}

PUT.apiSpec = {
    "summary": "Updates company type with id {id}",
    "description": "Put request on company type by id {id}",
    "tags": [
        "Companytype"
    ],
    "requestBody": {
        "description": "Add companytype",
        "content": {
            "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/companytype"
                }
            }
        }
    },
    "parameters": [
        {
            "$ref": "#/components/parameters/if-match"
        }
    ],
    "responses": {
        "204": {
            "$ref": "#/components/responses/204-updated"
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