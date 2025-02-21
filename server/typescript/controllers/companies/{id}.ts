import { getCompanyById, deleteCompanyById, putCompanyById } from '../../services/companies.js'
import { NotFoundError, error_formatter } from "../../services/error.js"
import type { Request, Response } from 'express'
import { CompanyClient, normalizeCompany, normalizeCompanyLocationEtag } from './index.js'
import { Operation } from '../../apiSpecAssembler.js'
import { MetaEtag } from '../../app.js'



export const GET: Operation = async (req: Request, res: Response) => {
    try {
        const company = await getCompanyById(Number(req.params.id))
        const companyClient: CompanyClient = normalizeCompany(company)
        const companyResponseMeta: MetaEtag = normalizeCompanyLocationEtag(company)
        res
            .status(200)
            .set(companyResponseMeta)
            .json(companyClient)
    }
    catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({ "status": 404, "message": "not found" })
        } else {
            throw err
        }
    }
}


GET.apiSpec = {
    "summary": "Get a certain company",
    "description": "GET request on a certain company by id {id}",
    "operationId": "getCompanyById",
    "security": [],
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
    catch (err) {
        if (err instanceof NotFoundError) {
            res
                .status(404)
                .json({ status: 404, message: "not found" })
        }
        else {
            throw err
        }
    }
}
DELETE.apiSpec = {
    "summary": "Remove a certain company",
    "description": "DELETE request on company by id {id}",
    "operationId": "deleteCompanyById",
    "security": [
        { "OAuth2": [
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
        }
    }
}

export const PUT: Operation = async (req: Request, res: Response) => {
    try {
        const dbCompany = await getCompanyById(Number(req.params.id))
        const dbCompanyMeta = normalizeCompanyLocationEtag(dbCompany)
        if (dbCompanyMeta.etag === req.headers['if-match']) {
            try {
                const updatedCompany = await putCompanyById(Number(req.params.id), req.body)
                const companyHeader = normalizeCompanyLocationEtag(updatedCompany)
                res.status(204)
                    .set(companyHeader)
                    .end()
            }
            catch (err) {
                res
                    .status(500)
                    .json(error_formatter(500, err))
            }
        }
        else {
            res
                .status(412)
                .json({ status: 412, message: "Precondition failed" })
        }
    }
    catch (err) {
        if (err instanceof NotFoundError) {
            res
                .status(404)
                .json({ status: 404, message: "not found" })
        } else {
            throw err
        }
    }
}
PUT.apiSpec = {
    "summary": "Updates company with id {id}",
    "description": "Put request on company by id {id}",
    "operationId": "putCompanyById",
    "security": [
        { "OAuth2": [
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
