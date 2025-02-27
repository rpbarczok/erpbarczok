import { getCompanyTypeById, deleteCompanyTypeById, putCompanyTypeById } from '../../services/companyTypes.js'
import { error_formatter, NotFoundError } from "../../services/error.js"
import type { Request, Response } from 'express'
import { CompanyTypeNorm, normalizeCompanyType, createCompanyTypeMeta } from './index.js'
import { Operation } from '../../utils/apiSpecAssembler.js'
import { Meta } from '../../app.js'
import { Company } from '../../models/companies.js'

export const GET: Operation = async (req: Request, res: Response) => {
    try {
        const companyType = await getCompanyTypeById(Number(req.params.id))
        const companyTypeNorm: CompanyTypeNorm = normalizeCompanyType(companyType)
        const companyTypeNormMeta: Meta = createCompanyTypeMeta(companyType)
        res
            .status(200)
            .set(companyTypeNormMeta)
            .json(companyTypeNorm)
    }
    catch (err) {
        if (err instanceof NotFoundError) res.status(404).json({ "status": 404, "message": "not found" })
        else throw err
    }
}


GET.apiSpec = {
    "summary": "Get a certain companyType",
    "description": "GET request on a certain companyType by id {id}",
    "operationId": "getCompanyTypeById",
    "security": [
        { "openId": [] }
    ],
    "tags": [
        "CompanyType"
    ],
    "parameters": [
        {
            "$ref": "#/components/parameters/id-in-path"
        }
    ],
    "responses": {
        "200": {
            "description": "Successful operation",
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": "#/components/schemas/companyType"

                    },
                    "examples": {
                        "companyType": {
                            "$ref": "#/components/examples/companyType"
                        }
                    }
                }
            },
            "headers": {
                "etag": {
                    "description": "Etag of the requested companyType",
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
                companyTypeId: Number(req.params.id)
            }
        })
        if (count === 0) {
            await deleteCompanyTypeById(Number(req.params.id))
            res.status(204).end()
        } else {
            res.status(409).json({ status: 409, message: "Conflict" })
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
    "operationId": "deleteCompanyTypeById",
    "security": [
        { "openId": [
            "admin"
        ] }
    ],
    "tags": [
        "CompanyType"
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
            "$ref": "#/components/responses/409_conflict_error"
        }
    }
}

export const PUT: Operation = async (req: Request, res: Response) => {
    try {
        const dbCompanyType = await getCompanyTypeById(Number(req.params.id))
        const dbCompanyTypeMeta = createCompanyTypeMeta(dbCompanyType)
        if (dbCompanyTypeMeta.etag === req.headers['if-match']) {
            try {
                const updatedCompanyType = await putCompanyTypeById(Number(req.params.id), req.body)
                const companyTypeHeader = createCompanyTypeMeta(updatedCompanyType)
                res
                    .status(204)
                    .set(companyTypeHeader)
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
    "operationId": "putCompanyTypeById",
    "security": [
        { "openId": [
            "admin"
        ] }
    ],
    "tags": [
        "CompanyType"
    ],
    "requestBody": {
        "description": "Add companyType",
        "content": {
            "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/companyType"
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