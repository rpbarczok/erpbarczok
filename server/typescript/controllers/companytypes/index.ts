import { DataWithMeta, Meta } from '../../app.js'
import { sha256 } from '../../hasher.js'
import { Companytype } from '../../models/companytypes.js'
import { getAllCompanytypes, addCompanytype } from '../../services/companytypes.js'
import { Request, Response } from 'express'
import { Operation } from '../../apiSpecAssembler.js'

export interface CompanytypeNorm {
    name: string
}

export function normalizeCompanytype(companytype: Companytype): CompanytypeNorm {
    const result: CompanytypeNorm = { name: companytype.name }
    return result
}

export function createCompanytypeMeta(companytype: Companytype): Meta {
    const companytypeNorm: CompanytypeNorm = normalizeCompanytype(companytype)
    return { "location": "/companytypes/" + companytype.id, "etag": sha256(JSON.stringify(companytypeNorm)) }
}

export function combineCompanytypeWithMeta(companytype: Companytype): DataWithMeta<CompanytypeNorm> {
    const data: CompanytypeNorm = normalizeCompanytype(companytype)
    const meta = createCompanytypeMeta(companytype)
    return { meta: meta, data: data }
}

export const GET: Operation = async (req: Request, res: Response) => {
    const allCompanytypes = await getAllCompanytypes()
    const allCompanytypesWithMeta: DataWithMeta<CompanytypeNorm>[] = allCompanytypes.map(row => combineCompanytypeWithMeta(row))
    res
        .status(200)
        .json(allCompanytypesWithMeta)
}

GET.apiSpec = {
    "summary": "Get a list of all company types",
    "description": "GET request on all companies",
    "operationId": "getCompanytypes",
    "security": [],
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
export const POST: Operation = async (req: Request, res: Response) => {
    const newCompanytype = await addCompanytype(req.body)
    const newCompanytypeMeta = createCompanytypeMeta(newCompanytype)
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
        {
            "openId": [
                "admin"
            ]
        }
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
