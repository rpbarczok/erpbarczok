import { getCompanyById, deleteCompanyById, putCompanyById } from '../../services/companies.js'
import { NotFoundError, error_formatter } from "../../services/error.js"
import type { Request, Response } from 'express'
import { CompanyNorm, normalizeCompany, createCompanyMeta } from './index.js'
import { Operation } from '../../utils/apiSpecAssembler.js'
import { Meta } from '../../app.js'



export const GET: Operation = async (req: Request, res: Response) => {
    try {
        const company = await getCompanyById(Number(req.params.id))
        const companyNorm: CompanyNorm = normalizeCompany(company)
        const metaHeader: Meta = createCompanyMeta(company)
        res
            .status(200)
            .set(metaHeader)
            .json(companyNorm)
    }
    catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ "status": 404, "message": "not found" })
        } else {
            throw error
        }
    }
}


GET.apiSpec = {
    "summary": "Get a certain company",
    "description": "GET request on a certain company by id {id}",
    "operationId": "getCompanyById",
    "security": [
        { "openId": [] }
    ],
    "tags": [
        "Company"
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
                        "$ref": "#/components/schemas/company"
                    },
                    "examples": {
                        "company": {
                            "$ref": "#/components/examples/company"
                        }
                    }
                }
            },
            "headers": {
                "etag": {
                    "description": "Etag of the requested company",
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
        await deleteCompanyById(Number(req.params.id))
        res
            .status(204)
            .end()
    }
    catch (error) {
        if (error instanceof NotFoundError) {
            res
                .status(404)
                .json({ status: 404, message: "not found" })
        }
        else {
            throw error
        }
    }
}
DELETE.apiSpec = {
    "summary": "Remove a certain company",
    "description": "DELETE request on company by id {id}",
    "operationId": "deleteCompanyById",
    "security": [
        { "openId": [
            "user"
        ] }
    ],
    "tags": [
        "Company"
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
        const oldCompany = await getCompanyById(Number(req.params.id))
        const oldCompanyWithMeta = createCompanyMeta(oldCompany)
        if (oldCompanyWithMeta.etag === req.headers['if-match']) {
            try {
                const updatedCompany = await putCompanyById(Number(req.params.id), req.body)
                const metaHeader = createCompanyMeta(updatedCompany)
                res.status(204)
                    .set(metaHeader)
                    .end()
            }
            catch (error) {
                res
                    .status(500)
                    .json(error_formatter(500, error))
            }
        }
        else {
            res
                .status(412)
                .json({ status: 412, message: "Precondition failed" })
        }
    }
    catch (error) {
        if (error instanceof NotFoundError) {
            res
                .status(404)
                .json({ status: 404, message: "not found" })
        } else {
            throw error
        }
    }
}
PUT.apiSpec = {
    "summary": "Updates company with id {id}",
    "description": "Put request on company by id {id}",
    "operationId": "putCompanyById",
    "security": [
        { "openId": [
            "user"
        ] }
    ],
    "tags": [
        "Company"
    ],
    "requestBody": {
        "description": "Add or update company",
        "content": {
            "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/company"
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
