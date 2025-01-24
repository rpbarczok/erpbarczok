import type { Request, Response } from 'express'
import { getAllCompanies, addCompany } from '../../services/companies.js'
import { Meta } from '../../app.js'
import { Company } from '../../models/companies.js'
import { sha256 } from '../../hasher.js'

export interface CompanyApi {
    name: string
    abbr?: string | null
    www?: string | null
}

export function normalize_company(company: Company) {
    const result: CompanyApi = { name: company.name }
    if (company.abbr) {
        result.abbr = company.abbr
    }
    if (company.www) {
        result.www = company.www
    }

    return { meta: { "location": "/companies/" + company.id, "etag": sha256(JSON.stringify(result)) }, data: result }
}

export const GET = async (req: Request, res: Response) => {
    const allCompanies = await getAllCompanies()
    const allCompaniesApi: Meta<CompanyApi>[] = allCompanies.map((row) => (normalize_company(row)))
    res.status(200).json(allCompaniesApi)
}

GET.apiSpec = {
    "summary": "Get a list of all companies",
    "description": "GET request on all companies",
    "tags": [
        "Company"
    ],
    "responses": {
        "200": {
            "description": "Successfull operation",
            "content": {
                "application/json": {
                    "schema": {
                        "type": "array",
                        "items": {
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
                    },
                    "examples": {
                        "example-of-three-companies": {
                            "value": [
                                {
                                    "meta": {
                                        "location": "/companies/1",
                                        "etag": "656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33850f818a"
                                    },
                                    "data": {
                                        "name": "Firma A",
                                        "abbr": "FRA"
                                    }
                                },
                                {
                                    "meta": {
                                        "location": "/companies/2",
                                        "etag": "656da9646b5a65673e4a1f504ac3d44282e2da0d939413619ef0fd33850f818a"
                                    },
                                    "data": {
                                        "name": "Firma B",
                                        "abbr": "FRB"
                                    }
                                },
                                {
                                    "meta": {
                                        "location": "/companies/3",
                                        "etag": "656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33853f818a"
                                    },
                                    "data": {
                                        "name": "Firma C",
                                        "abbr": "FRC"
                                    }
                                }
                            ]
                        },
                        "empty-array": {
                            "value": []
                        }
                    }
                }
            }
        }
    }
}

export const POST = async (req: Request, res: Response) => {
    res.status(201).set({ location: "/companies/" + await addCompany(req.body) }).end()
}
POST.apiSpec = {
    "summary": "Create new company",
    "description": "POST request for a new company, response new id",
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
    "responses": {
        "201": {
            "description": "Successfull operation",
            "headers": {
                "location": {
                    "description": "Relative URI of the new company",
                    "schema": {
                        "$ref": "#/components/schemas/location"
                    }
                }
            }
        },
        "400": {
            "$ref": "#/components/responses/400-validation-error"
        }
    }
}