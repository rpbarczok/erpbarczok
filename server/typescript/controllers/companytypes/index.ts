import { Meta, MetaEtag } from '../../app.js'
import { sha256 } from '../../hasher.js'
import { Companytype } from '../../models/companytypes.js'
import { getAllCompanytypes, addCompanytype } from '../../services/companytypes.js'
import { Request, Response } from 'express'
import { Operation } from '../../apiSpecAssembler.js'

export interface CompanytypeServer {
    name: string
}

export function normalizeCompanytype(companytype: Companytype): CompanytypeServer {
    const result: CompanytypeServer = { name: companytype.name }
    return result
}

export function normalizeCompanytypeLocationEtag(companytype: Companytype): MetaEtag {
    const companytypeServer: CompanytypeServer = normalizeCompanytype(companytype)
    return { "location": "/companytypes/" + companytype.id, "etag": sha256(JSON.stringify(companytypeServer)) }
}

export function normalizeCompanytypeMeta(companytype: Companytype): Meta<CompanytypeServer> {
    const data: CompanytypeServer = normalizeCompanytype(companytype)
    const meta = normalizeCompanytypeLocationEtag(companytype)
    return { meta: meta, data: data }
}

export const GET: Operation = async (req: Request, res: Response) => {
    const allCompanytypes = await getAllCompanytypes()
    const allCompanytypeServer: Meta<CompanytypeServer>[] = allCompanytypes.map(row => normalizeCompanytypeMeta(row))
    res
    .status(200)
    .json(allCompanytypeServer)
}

GET.apiSpec = {
    "summary": "Get a list of all company types",
    "description": "GET request on all companies",
    "operationId": "getCompanytypes",
    "security": [
        { "OAuth2": [
            "openid"
        ] }
    ],
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
                                    "meta": {
                                        "location": "/companytypes/1",
                                        "etag": "656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33850f818a"
                                    },
                                    "data": {
                                        "name": "Kunde"
                                    }
                                },
                                {
                                    "meta": {
                                        "location": "/companytypes/2",
                                        "etag": "656da9646b5a65673e5a1f504ac3d44232e2da0d939413619ef0fd33850f818a"
                                    },
                                    "data": {
                                        "name": "Interessent"
                                    }
                                },
                                {
                                    "meta": {
                                        "location": "/companytypes/3",
                                        "etag": "656da9646b5a65673e4a1f504ac3d44262e2da0d939413619ef0fd33850f818a"
                                    },
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
            "$ref": "#/components/responses/400_validation_error"
        },
        "404": {
            "$ref": "#/components/responses/404_not_found_error"
        }
    }
}
export const POST:Operation = async (req: Request, res: Response) => {
    const newCompanytype = await addCompanytype(req.body)
    const newCompanytypeMeta = normalizeCompanytypeLocationEtag(newCompanytype)
    res
        .status(201)
        .set(newCompanytypeMeta)
        .end()
}
POST.apiSpec = {
    "summary": "Add new company type",
    "description": "POST request for a new company type",
    "operationId": "postCompanytype",
    "security": [
        { "OAuth2": [
            "admin"
        ] }
    ],
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
            "$ref": "#/components/responses/201"
        },
        "400": {
            "$ref": "#/components/responses/400_validation_error"
        }
    }
}
