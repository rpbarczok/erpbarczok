import { getAllCompanies, addCompany } from '../../services/companies.js';
function normalize_company(company) {
    if (company.abbr) {
        return {
            name: company.name,
            abbr: company.abbr
        };
    }
    else {
        return {
            name: company.name
        };
    }
}
export const GET = async (req, res) => {
    const allCompanies = await getAllCompanies();
    const allCompaniesApi = allCompanies.map((row) => ({ "location": "/companies/" + row.id, "company": normalize_company(row) }));
    res.status(200).json(allCompaniesApi);
};
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
                                "company"
                            ],
                            "additionalProperties": false,
                            "properties": {
                                "location": {
                                    "$ref": "#/components/schemas/location"
                                },
                                "company": {
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
                                    "company": {
                                        "name": "Firma A",
                                        "abbr": "FRA"
                                    }
                                },
                                {
                                    "location": "/companies/2",
                                    "company": {
                                        "name": "Firma B",
                                        "abbr": "FRB"
                                    }
                                },
                                {
                                    "location": "/companies/3",
                                    "company": {
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
};
export const POST = async (req, res) => res.status(201).set({ location: "/companies/" + await addCompany(req.body) }).end();
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
};
