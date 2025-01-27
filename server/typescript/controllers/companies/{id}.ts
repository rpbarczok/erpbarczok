import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types.js'
import { getCompanyById, deleteCompanyById, putCompanyById } from '../../services/companies.js'
import { NotFoundError, error_formatter } from "../../services/error.js"
import type { Request, Response } from 'express'
import { sha256 } from '../../hasher.js'
import { CompanyResponse, normalizeCompany, normalizeCompanyMetaHeader, normalizeCompanyMetaData, normalizeCompanyMetaContent } from './index.js'
import { Operation } from '../../apiSpecAssembler.js'
import { MetaHeader } from '../../app.js'

export const GET: Operation = async (req: Request, res: Response) => {
    try {
        const company = await getCompanyById(Number(req.params.id))
        const companyResponse: CompanyResponse = normalizeCompany(company)
        const companyResponseMeta: MetaHeader = normalizeCompanyMetaHeader(company)
        res
            .status(200)
            .set(companyResponseMeta)
            .json(companyResponse)
    }
    catch (err) {
        if (err instanceof NotFoundError) res.status(404).json({ "status": 404, "message": "not found" })
        else throw err
    }
}


GET.apiSpec = {
    "summary": "Get a certain company",
    "description": "GET request on a certain company by id {id}",
    "tags": [
        "Company"
    ],
    "responses": {
        "200": {
            "description": "Successfull operation",
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
                "location": {
                    "description": "Location of the requested company",
                    "schema": {
                        "$ref": "#/components/schemas/location"
                    }
                },
                "if-match": {
                    "description": "Etag of the requested company",
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
        await deleteCompanyById(Number(req.params.id))
        res
            .status(204)
            .end()
    }
    catch (err) {
        if (err instanceof NotFoundError) res.status(404).json({ status: 404, message: "not found" })
        else throw err
    }
}
DELETE.apiSpec = {
    "summary": "Remove a certain company",
    "description": "DELETE request on company by id {id}",
    "tags": [
        "Company"
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
        const dbCompany = await getCompanyById(Number(req.params.id))
        const dbCompanyMeta = normalizeCompanyMetaContent(dbCompany)
        if (dbCompanyMeta.etag === req.headers['if-match']) {
            try {
                await putCompanyById(Number(req.params.id), req.body)
                res.status(204)
                    .end()
            }
            catch (err) {
                error_formatter(500, err)
            }
        }
        else {
            res.status(412).json({ status: 412, message: "Precondition failed" })
        }
    }
    catch (err) {
        if (err instanceof NotFoundError) res.status(404).json({ status: 404, message: "not found" })
        else throw err
    }
}
PUT.apiSpec = {
    "summary": "Updates company with id {id}",
    "description": "Put request on company by id {id}",
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
        }
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