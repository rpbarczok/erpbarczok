import type { Request, Response } from 'express'
import { getAllCompanies, addCompany } from '../../services/companies.js'
import { DataWithMeta, Meta } from '../../app.js'
import { Company } from '../../models/companies.js'
import { sha256 } from '../../hasher.js'
import { Operation } from '../../utils/apiSpecAssembler.js'

export interface CompanyNorm {
    name: string
    abbr?: string | null
    www?: string | null
    companyType: string
}

export interface CompanyFK {
    name: string
    abbr?: string | null
    www?: string | null
    companyTypeId: number
}

export function normalizeCompany(company: Company) {
    const result: CompanyNorm = { name: company.name, companyType: company.companyType!.name}
    if (company.abbr) {
        result.abbr = company.abbr
    }
    if (company.www) {
        result.www = company.www
    }
    return result
}

export function combineCompanyWithMeta(company: Company): DataWithMeta<CompanyNorm> {
    const data: CompanyNorm = normalizeCompany(company)
    const meta: Meta = createCompanyMeta(company)
    return { meta: meta, data: data }
}

export function createCompanyMeta(company: Company): Meta {
    const companyNorm: CompanyNorm = normalizeCompany(company)
    return { "location": "/companies/" + company.id, "etag": sha256(JSON.stringify(companyNorm)) }
}

export const GET: Operation = async (req: Request, res: Response) => {
    // @ts-ignore
    const allCompanies = await getAllCompanies()
    const allCompaniesWithMeta: DataWithMeta<CompanyNorm>[] = allCompanies.map((row) => (combineCompanyWithMeta(row)))
    res
        .status(200)
        .json(allCompaniesWithMeta)
}

GET.apiSpec = {
    "summary": "Get a list of all companies",
    "description": "GET request on all companies",
    "operationId": "getCompanies",
    "security": [
        { "openId": [] }
    ],
    "tags": [
        "Company"
    ],
    "responses": {
        "200": {
            "description": "Successful operation",
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
                                        "abbr": "FRA",
                                        "companyType": "Kunde"
                                    }
                                },
                                {
                                    "meta": {
                                        "location": "/companies/2",
                                        "etag": "656da9646b5a65673e4a1f504ac3d44282e2da0d939413619ef0fd33850f818a"
                                    },
                                    "data": {
                                        "name": "Firma B",
                                        "abbr": "FRB",
                                        "companyType": "Lieferant"
                                    }
                                },
                                {
                                    "meta": {
                                        "location": "/companies/3",
                                        "etag": "656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33853f818a"
                                    },
                                    "data": {
                                        "name": "Firma C",
                                        "abbr": "FRC",
                                        "companyType": "Spediteur"
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

export const POST: Operation = async (req: Request, res: Response) => {
    const newCompany = await addCompany(req.body)
    res.status(204)
        .set(createCompanyMeta(newCompany))
        .end()
}
POST.apiSpec = {
    "summary": "Create new company",
    "description": "POST request for a new company, response new id",
    "operationId": "postCompany",
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
    "responses": {
        "201": {
            "$ref": "#/components/responses/201"
        },
        "400": {
            "$ref": "#/components/responses/400_validation_error"
        }
    }
}
