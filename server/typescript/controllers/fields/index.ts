import { DataWithMeta, Meta } from '../../app.js'
import { sha256 } from '../../hasher.js'
import { Field } from '../../models/fields.js'
import { getAllFields, addField } from '../../services/fields.js'
import { Request, Response } from 'express'
import { Operation } from '../../utils/apiSpecAssembler.js'
import { createNewError, ErrorWithStatus } from '../../services/error.js'

export interface FieldNorm {
    name: string
}

export const isFieldNorm = (value: unknown): value is FieldNorm => {
    if (typeof value === 'object' && value !== null ) {
        const keys = Object.keys(value)
        if (keys.includes('name')) {
            return (keys.every(key => ['name'].includes(key)))
        }
    }
    return false
} 

export function normalizeField(field: Field): FieldNorm {
    const result: FieldNorm = { name: field.name }
    return result
}

export function createFieldMeta(field: Field): Meta {
    const fieldNorm: FieldNorm = normalizeField(field)
    return { 'location': '/fields/' + field.id, 'etag': sha256(JSON.stringify(fieldNorm)) }
}

export function combineFieldWithMeta(field: Field): DataWithMeta<FieldNorm> {
    const data: FieldNorm = normalizeField(field)
    const meta = createFieldMeta(field)
    return { meta: meta, data: data }
}

export const GET: Operation = async (req: Request, res: Response) => {
    const allFieldsSearchResult = await getAllFields()
    if (allFieldsSearchResult instanceof ErrorWithStatus) {
        res
        .status(allFieldsSearchResult.status)
        .send({status: allFieldsSearchResult.status, message: allFieldsSearchResult.message})
        .end()
    } else {
        const allFieldsWithMeta: DataWithMeta<FieldNorm>[] = allFieldsSearchResult.map(row => combineFieldWithMeta(row))
        res
            .status(200)
            .send(allFieldsWithMeta)
            .end()
    }
}

GET.apiSpec = {
    'summary': 'Get a list of all fields',
    'description': 'GET request on all fields',
    'operationId': 'getFields',
    'security': [
        { 'openId': [] }
    ],
    'tags': [
        'Field'
    ],
    'responses': {
        '200': {
            'description': 'Successful operation',
            'content': {
                'application/json': {
                    'schema': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'required': [
                                'meta',
                                'data'
                            ],
                            'additionalProperties': false,
                            'properties': {
                                'meta': {
                                    '$ref': '#/components/schemas/meta'
                                },
                                'data': {
                                    '$ref': '#/components/schemas/field'
                                }
                            }
                        }
                    },
                    'examples': {
                        'example-of-three-fields': {
                            'value': [
                                {
                                    'meta': {
                                        'location': '/fields/1',
                                        'etag': '656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33850f818a'
                                    },
                                    'data': {
                                        'name': 'Lebensmittel'
                                    }
                                },
                                {
                                    'meta': {
                                        'location': '/fields/2',
                                        'etag': '656da9646b5a65673e5a1f504ac3d44232e2da0d939413619ef0fd33850f818a'
                                    },
                                    'data': {
                                        'name': 'Haushaltsgeräte'
                                    }
                                },
                                {
                                    'meta': {
                                        'location': '/fields/3',
                                        'etag': '656da9646b5a65673e4a1f504ac3d44262e2da0d939413619ef0fd33850f818a'
                                    },
                                    'data': {
                                        'name': 'Recht'
                                    }
                                }
                            ]
                        },
                        'empty-array': {
                            'value': []
                        }
                    }
                }
            }
        },
        '400': {
            '$ref': '#/components/responses/400_validation_error'
        },
        '401': {
            '$ref': '#/components/responses/401_authorization_error'
        },
        '404': {
            '$ref': '#/components/responses/404_not_found_error'
        }
    }
}
export const POST: Operation = async (req: Request, res: Response) => {
    if (isFieldNorm(req.body)) {
        const newFieldAddResult = await addField(req.body)
        if (newFieldAddResult instanceof ErrorWithStatus) {
            res
            .status(newFieldAddResult.status)
            .json({status: newFieldAddResult.status, message: newFieldAddResult.message})
            .end()
        } else {
            const newFieldMeta = createFieldMeta(newFieldAddResult)
            res
                .status(201)
                .set(newFieldMeta)
                .end()
        }
    } else {
        res
        .status(400)
        .json(createNewError(400))
    }

}

POST.apiSpec = {
    'summary': 'Add new field',
    'description': 'POST request for a new field',
    'operationId': 'postField',
    'security': [
        {
            'openId': [
                'admin'
            ]
        }
    ],
    'tags': [
        'Field'
    ],
    'requestBody': {
        'description': 'Add field',
        'content': {
            'application/json': {
                'schema': {
                    '$ref': '#/components/schemas/field'
                }
            }
        }
    },
    'responses': {
        '201': {
            '$ref': '#/components/responses/201'
        },
        '401': {
            '$ref': '#/components/responses/401_authorization_error'
        },
        '400': {
            '$ref': '#/components/responses/400_validation_error'
        }
    }
}
