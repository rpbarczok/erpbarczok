import type { Request, Response } from 'express'
import { getAllCompanies, addCompany } from '../../services/companies.js'
import { Loc } from '../../app.js'

export interface CompanyApi {
    name: string
    abbr?: string | null
    www?: string | null
}

function normalize_company(company: CompanyApi): CompanyApi {
    if (company.abbr) {
        return {
            name: company.name,
            abbr: company.abbr
        }
    } else {
        return {
            name: company.name
        }
    }
}

export const GET = async (req: Request, res: Response) => {
    const allCompanies = await getAllCompanies()
    const allCompaniesApi: Loc<CompanyApi>[] = allCompanies.map((row) => ({ "location": "/companies/" + row.id, "data": normalize_company(row) }))
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
                                "location",
                                "data"
                            ],
                            "additionalProperties": false,
                            "properties": {
                                "location": {
                                    "$ref": "#/components/schemas/location"
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
                                    "location": "/companies/1",
                                    "data": {
                                        "name": "Firma A",
                                        "abbr": "FRA"
                                    }
                                },
                                {
                                    "location": "/companies/2",
                                    "data": {
                                        "name": "Firma B",
                                        "abbr": "FRB"
                                    }
                                },
                                {
                                    "location": "/companies/3",
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

export const POST = async (req: Request, res: Response) => res.status(201).set({ location: "/companies/"+ await addCompany(req.body) }).end()
POST.apiSpec = {
    "summary": "Create new company",
    "description": "POST request for a new company, response new id",
    "tags": [
        "Company"
    ],
    "requestBody": {
        "$ref": "#/components/requestBodies/company"
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