import { getCompanytypeById, deleteCompanytypeById, putCompanytypeById } from '../../services/companytypes.js'
import { error_formatter, NotFoundError } from "../../services/error.js"
import type { Request, Response } from 'express'
import { CompanytypeServer, normalizeCompanytype, createCompanytypeMeta } from './index.js'
import { Operation } from '../../apiSpecAssembler.js'
import { Meta } from '../../app.js'
import { Company } from '../../models/companies.js'

export const GET: Operation = async (req: Request, res: Response) => {
    try {
        const companytype = await getCompanytypeById(Number(req.params.id))
        const companytypeNorm: CompanytypeServer = normalizeCompanytype(companytype)
        const companytypeNormMeta: Meta = createCompanytypeMeta(companytype)
        res
            .status(200)
            .set(companytypeNormMeta)
            .json(companytypeNorm)
    }
    catch (err) {
        if (err instanceof NotFoundError) res.status(404).json({ "status": 404, "message": "not found" })
        else throw err
    }
}


GET.apiSpec = {
    "summary": "Get a certain companytype",
    "description": "GET request on a certain companytype by id {id}",
    "operationId": "getCompanytypeById",
    "security": [
        { "openId": [] }
    ],
    "tags": [
        "Companytype"
    ],
    "parameters": [
        {
            "$ref": "#/components/parameters/id-in-path"
        }
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
                "etag": {
                    "description": "Etag of the requested companytype",
                    "schema": {
                        "$ref": "#/components/schemas/etag"
                    }
                }
            }
        },
        "400": {
            "$ref": "#/components/responses/400_validation_error"
        },
        "404": {
            "$ref": "#/components/responses/404_not_found_error"
        }
    }
}

export const DELETE: Operation = async (req: Request, res: Response) => {
    try {
        const { count, rows } = await Company.findAndCountAll({
            where: {
                companytypeId: Number(req.params.id)
            }
        })
        if (count === 0) {
            await deleteCompanytypeById(Number(req.params.id))
            res.status(204).end()
        } else {
            res.status(409).end()
        }

    }
    catch (err) {
        if (err instanceof NotFoundError) res.status(404).json({ status: 404, message: "not found" })
        else throw err
    }
}
DELETE.apiSpec = {
    "summary": "Remove a certain company type",
    "description": "DELETE request on company type by id {id}",
    "operationId": "deleteCompanytypeById",
    "security": [
        { "openId": [
            "admin"
        ] }
    ],
    "tags": [
        "Companytype"
    ],
    "parameters": [
        {
            "$ref": "#/components/parameters/id-in-path"
        }
    ],
    "responses": {
        "204": {
            "$ref": "#/components/responses/204_success"
        },
        "400": {
            "$ref": "#/components/responses/400_validation_error"
        },
        "404": {
            "$ref": "#/components/responses/404_not_found_error"
        },
        "409": {
            "$ref": "#/components/responses/409_conflict"
        }
    }
}

export const PUT: Operation = async (req: Request, res: Response) => {
    try {
        const dbCompanytype = await getCompanytypeById(Number(req.params.id))
        const dbCompanytypeMeta = createCompanytypeMeta(dbCompanytype)
        if (dbCompanytypeMeta.etag === req.headers['if-match']) {
            try {
                const updatedCompanytype = await putCompanytypeById(Number(req.params.id), req.body)
                const companytypeHeader = createCompanytypeMeta(updatedCompanytype)
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
    "operationId": "putCompanytypeById",
    "security": [
        { "openId": [
            "admin"
        ] }
    ],
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
        },
        {
            "$ref": "#/components/parameters/id-in-path"
        }
    ],
    "responses": {
        "204": {
            "$ref": "#/components/responses/204_updated"
        },
        "400": {
            "$ref": "#/components/responses/400_validation_error"
        },
        "404": {
            "$ref": "#/components/responses/404_not_found_error"
        },
        "412": {
            "$ref": "#/components/responses/412_precondition_error"
        }
    }
}