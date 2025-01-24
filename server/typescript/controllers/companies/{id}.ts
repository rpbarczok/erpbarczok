import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types.js'
import { getCompanyById, deleteCompanyById, putCompanyById } from '../../services/companies.js'
import { NotFoundError, error_formatter } from "../../services/error.js"
import type { Request, Response } from 'express'
import { CompanyApi } from './index.js'
import { Meta } from '../../app.js'
import { normalize_company } from './index.js'
import { sha256 } from '../../hasher.js'

// as Meta<Company>
export const GET = async (req: Request, res: Response) => {
    try {
        const company = await getCompanyById(Number(req.params.id))
        const companyApi: Meta<CompanyApi> = normalize_company(company)
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
                            "meta",
                            "data"
                        ],
                        "additionalProperties": false,
                        "properties": {
                            "meta": {
                                "$ref": "#/components/schemas/meta"
                            },
                            "data": {
                                "$ref": "#/components/schemas/company"
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
        const dbData = await getCompanyById(Number(req.params.id))
        const company = normalize_company(dbData)
        const dbHash = sha256(JSON.stringify(company.data))
        if (dbHash === req.body.meta.etag) {
            try {
                await putCompanyById(Number(req.params.id), req.body.data)
                res.status(204).end()
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
                            "$ref": "#/components/schemas/company"
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