import { Loc } from '../../app.js'
import { getAllCompanytypes, addCompanytype } from '../../services/companytypes.js'
import { Request, Response } from 'express'

export interface CompanytypeApi {
    name: string
}

export const GET = async (req: Request, res: Response) => {
    const allCompanytypes = await getAllCompanytypes()
    const allCompanytypesApi: Loc<CompanytypeApi>[] = allCompanytypes.map(row => ({ "location": "/companytypes/" + row.id, "data": { "name": row.name } }))
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
                                "location",
                                "data"
                            ],
                            "additionalProperties": false,
                            "properties": {
                                "location": {
                                    "$ref": "#/components/schemas/location"
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
export const POST = async (req: Request, res: Response) => res.status(201).set({ location: "/location/" + String(await addCompanytype(req.body)) }).end()

POST.apiSpec = {
    "summary": "Add new company type",
    "description": "POST request for a new company type",
    "tags": [
        "Companytype"
    ],
    "requestBody": {
        "$ref": "#/components/requestBodies/companytype"
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