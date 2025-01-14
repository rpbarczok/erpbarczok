import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types.js'
import { getCompanyById, deleteCompanyById, putCompanyById } from '../../services/companies.js'
import { NotFoundError } from "../../services/error.js"
import type { Request, Response } from 'express'
import { CompanyApi, CompanyApiResponse } from './index.js'

function normalize_company(company: CompanyApi) {
    const result:CompanyApi = { name: company.name }
    if (company.abbr) {
        result.abbr = company.abbr
    }
    if (company.www) {
        result.www = company.www
    }
    return result
}

// as CompanyApiResponse
export const GET = async (req: Request, res: Response) => {
    try {
        const company = await getCompanyById(Number(req.params.id))
        const companyApi: CompanyApiResponse = { "location": "/companies/" + company.id, "company": normalize_company(company) }
        res.status(200).json(companyApi)
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
                        "type": "object",
                        "required": [
                            "location",
                            "company"
                        ],
                        "additionalProperties": false,
                        "properties": {
                            "location": {
                                "$ref": "#/components/schemas/location"
                            },
                            "company": {
                                "$ref": "#/components/schemas/company-full"
                            }
                        }
                    },
                    "examples": {
                        "company": {
                            "$ref": "#/components/examples/company"
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
        await deleteCompanyById(Number(req.params.id))
        res.status(204).end()
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

export const PUT = async (req: Request, res: Response) => {
    try {
        await putCompanyById(Number(req.params.id), req.body)
        res.status(204).end()
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
        "$ref": "#/components/requestBodies/company"
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