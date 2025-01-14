import { getAllCompanytypes, addCompanytype } from '../../services/companytypes.js';
export const GET = async (req, res) => {
    const allCompanytypes = await getAllCompanytypes();
    const allCompanytypesApi = allCompanytypes.map(row => ({ "location": "/companytypes/" + row.id, "companytype": { "name": row.name } }));
    res.status(200).json(allCompanytypesApi);
};
GET.apiSpec = {
    "summary": "Get a list of all company types",
    "description": "GET request on all companies",
    "tags": [
        "Company Type"
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
                                "companytype"
                            ],
                            "additionalProperties": false,
                            "properties": {
                                "location": {
                                    "$ref": "#/components/schemas/location"
                                },
                                "companytype": {
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
                                    "companytype": {
                                        "name": "Kunde"
                                    }
                                },
                                {
                                    "location": "/companytypes/2",
                                    "companytype": {
                                        "name": "Interessent"
                                    }
                                },
                                {
                                    "location": "/companytypes/3",
                                    "companytype": {
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
};
export const POST = async (req, res) => res.status(201).set({ location: "/location/" + String(await addCompanytype(req.body)) }).end();
POST.apiSpec = {
    "summary": "Add new company type",
    "description": "POST request for a new company type",
    "tags": [
        "Company Type"
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
};
