import { Meta } from '../../app.js'
import { sha256 } from '../../hasher.js'
import { Companytype } from '../../models/companytypes.js'
import { getAllCompanytypes, addCompanytype } from '../../services/companytypes.js'
import { Request, Response } from 'express'

export interface CompanytypeApi {
    name: string
}

export function normalize_companytype(companytype: Companytype) {
    const result: CompanytypeApi = {name: companytype.name}
    return { "meta": {"location": "/companytypes/" + companytype.id, "etag": sha256(JSON.stringify(result))}, "data": result}
}

export const GET = async (req: Request, res: Response) => {
    const allCompanytypes = await getAllCompanytypes()
    const allCompanytypesApi: Meta<CompanytypeApi>[] = allCompanytypes.map(row => normalize_companytype(row))
    res.status(200).json(allCompanytypesApi)
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
export const POST = async (req: Request, res: Response) => res.status(201).set({ location: "/companytypes/" + String(await addCompanytype(req.body)) }).end()

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
                }
            }
        },
        "400": {
            "$ref": "#/components/responses/400-validation-error"
        }
    }
}