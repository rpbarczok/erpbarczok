import { getCompanytypeById, deleteCompanytypeById, putCompanytypeById } from '../../services/companytypes.js';
import { NotFoundError } from "../../services/error.js";
export const GET = async (req, res) => {
    try {
        const companytype = await getCompanytypeById(Number(req.params.id));
        const companytypeApi = { "location": "/companytypes/" + companytype.id, "companytype": { name: companytype.name } };
        res.status(200).json(companytypeApi);
    }
    catch (err) {
        if (err instanceof NotFoundError)
            res.status(404).json({ "status": 404, "message": "not found" });
        else
            throw err;
    }
};
// //
GET.apiSpec = {
    "summary": "Get a certain company type",
    "description": "GET request on a certain company type by id {id}",
    "tags": [
        "Company Type"
    ],
    "responses": {
        "200": {
            "description": "Successfull operation",
            "content": {
                "application/json": {
                    "schema": {
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
                    },
                    "examples": {
                        "company": {
                            "$ref": "#/components/examples/companytype"
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
export const DELETE = async (req, res) => {
    try {
        await deleteCompanytypeById(Number(req.params.id));
        res.status(204).end();
    }
    catch (err) {
        if (err instanceof NotFoundError)
            res.status(404).json({ status: 404, message: "not found" });
        else
            throw err;
    }
};
DELETE.apiSpec = {
    "summary": "Remove a certain company type",
    "description": "DELETE request on company type by id {id}",
    "tags": [
        "Company Type"
    ],
    "responses": {
        "204": {
            "$ref": "#/components/responses/204-success"
        },
        "400": {
            "$ref": "#/components/responses/400-validation-error"
        },
        "404": {
            "$ref": "#/components/responses/404-not-found-error"
        }
    }
};
export const PUT = async (req, res) => {
    try {
        await putCompanytypeById(Number(req.params.id), req.body);
        res.status(204).end();
    }
    catch (err) {
        if (err instanceof NotFoundError)
            res.status(404).json({ status: 404, message: "not found" });
        else
            throw err;
    }
};
PUT.apiSpec = {
    "summary": "Updates company type with id {id}",
    "description": "Put request on company type by id {id}",
    "tags": [
        "Company Type"
    ],
    "requestBody": {
        "$ref": "#/components/requestBodies/companytype"
    },
    "responses": {
        "204": {
            "$ref": "#/components/responses/204-success"
        },
        "400": {
            "$ref": "#/components/responses/400-validation-error"
        },
        "404": {
            "$ref": "#/components/responses/404-not-found-error"
        }
    }
};
export const apiSpec = {
    "parameters": [
        {
            "$ref": "#/components/parameters/id-in-path"
        }
    ]
};
