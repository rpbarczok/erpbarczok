import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types.js'
import { Meta, MetaContent, MetaHeader } from '../../app.js'
import { sha256 } from '../../hasher.js'
import { Companytype } from '../../models/companytypes.js'
import { getAllCompanytypes, addCompanytype } from '../../services/companytypes.js'
import { Request, Response } from 'express'
import { Operation } from '../../apiSpecAssembler.js'

export interface CompanytypeResponse {
    name: string
}

export function normalizeCompanytype(companytype: Companytype): CompanytypeResponse {
    const result: CompanytypeResponse = { name: companytype.name }
    return result
}

export function normalizeCompanytypeMetaContent(companytype: Companytype): MetaContent {
    const companytypeResponse: CompanytypeResponse = normalizeCompanytype(companytype)
    return { "location": "/companytypes/" + companytype.id, "etag": sha256(JSON.stringify(companytypeResponse)) }
}

export function normalizeCompanytypeMetaHeader(companytype: Companytype): MetaHeader {
    const companytypeResponse: CompanytypeResponse = normalizeCompanytype(companytype)
    return { "location": "/companytypes/" + companytype.id, "if-match": sha256(JSON.stringify(companytypeResponse)) }
}

export function normalizeCompanytypeMetaData(companytype: Companytype): Meta<CompanytypeResponse> {
    const data: CompanytypeResponse = normalizeCompanytype(companytype)
    const meta = normalizeCompanytypeMetaContent(companytype)
    return { meta: meta, data: data }
}

export const GET: Operation = async (req: Request, res: Response) => {
    const allCompanytypes = await getAllCompanytypes()
    const allCompanytypeResponse: Meta<CompanytypeResponse>[] = allCompanytypes.map(row => normalizeCompanytypeMetaData(row))
    res
    .status(200)
    .json(allCompanytypeResponse)
}
GET.apiSpec = {
    "summary": "Get a list of all company types",
    "description": "GET request on all companies",
    "tags": [
        "Companytype"
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
                                    "$ref": "#/components/schemas/companytype"
                                }
                            }
                        }
                    },
                    "examples": {
                        "example-of-three-companytypes": {
                            "value": [
                                {
                                    "location": "/companytypes/1",
                                    "data": {
                                        "name": "Kunde"
                                    }
                                },
                                {
                                    "location": "/companytypes/2",
                                    "data": {
                                        "name": "Interessent"
                                    }
                                },
                                {
                                    "location": "/companytypes/3",
                                    "data": {
                                        "name": "Spediteur"
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
        },
        "400": {
            "$ref": "#/components/responses/400-validation-error"
        },
        "404": {
            "$ref": "#/components/responses/404-not-found-error"
        }
    }
}
export const POST:Operation = async (req: Request, res: Response) => {
    const newCompanytype = await addCompanytype(req.body)
    const newCompanytypeMeta = normalizeCompanytypeMetaHeader(newCompanytype)
    res
        .status(201)
        .set(newCompanytypeMeta)
        .end()
}
POST.apiSpec = {
    "summary": "Add new company type",
    "description": "POST request for a new company type",
    "tags": [
        "Companytype"
    ],
    "requestBody": {
        "description": "Add company type",
        "content": {
            "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/companytype"
                }
            }
        }
    },
    "responses": {
        "201": {
            "description": "Successfull operation",
            "headers": {
                "location": {
                    "description": "Relative URI of the new company type",
                    "schema": {
                        "$ref": "#/components/schemas/location"
                    }
                },
                "if-match": {
                    "description": "Etag of the new company",
                    "schema": {
                        "$ref": "#/components/schemas/etag"
                    }
                }
            }
        },
        "400": {
            "$ref": "#/components/responses/400-validation-error"
        }
    }
}
