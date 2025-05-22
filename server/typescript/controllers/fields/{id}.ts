import { getFieldById, deleteFieldById, putFieldById } from '../../services/fields.js'
import { ApiError } from '../controllersError.js'
import type { NextFunction, Request, Response } from 'express'
import { FieldNorm, normalizeField, createFieldMeta, isFieldNorm } from './index.js'
import { Operation } from '../../utils/apiSpecAssembler.js'
import { Meta } from '../../app.js'
import { NotFoundError } from '../../services/servicesError.js'

export const GET: Operation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fieldSearchResult = await getFieldById(Number(req.params.id))
        const fieldNorm: FieldNorm = normalizeField(fieldSearchResult)
        const fieldNormMeta: Meta = createFieldMeta(fieldSearchResult)
        res
            .status(200)
            .set(fieldNormMeta)
            .json(fieldNorm)
    } catch (error) {
        if (error instanceof NotFoundError) {
            next(new ApiError(404, error.message))
            return
        } else {
            throw error
        }
    }


}

GET.apiSpec = {
    'summary': 'Get a certain field',
    'description': 'GET request on a certain field by id {id}',
    'operationId': 'getFieldById',
    'security': [
        { 'openId': [] }
    ],
    'tags': [
        'Field'
    ],
    'parameters': [
        {
            '$ref': '#/components/parameters/id-in-path'
        }
    ],
    'responses': {
        '200': {
            'description': 'Successful operation',
            'content': {
                'application/json': {
                    'schema': {
                        '$ref': '#/components/schemas/field'

                    },
                    'examples': {
                        'field': {
                            '$ref': '#/components/examples/field'
                        }
                    }
                }
            },
            'headers': {
                'etag': {
                    'description': 'Etag of the requested field',
                    'schema': {
                        '$ref': '#/components/schemas/etag'
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

export const DELETE: Operation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteFieldById(Number(req.params.id))
        res
            .status(204)
            .end()
    } catch (error) {
        if (error instanceof NotFoundError) {
            next(new ApiError(404, error.message))
            return
        } else {
            throw error
        }
    }
}

DELETE.apiSpec = {
    'summary': 'Remove a certain field',
    'description': 'DELETE request on field by id {id}',
    'operationId': 'deleteFieldById',
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
    'parameters': [
        {
            '$ref': '#/components/parameters/id-in-path'
        }
    ],
    'responses': {
        '204': {
            '$ref': '#/components/responses/204_success'
        },
        '400': {
            '$ref': '#/components/responses/400_validation_error'
        },
        '401': {
            '$ref': '#/components/responses/401_authorization_error'
        },
        '404': {
            '$ref': '#/components/responses/404_not_found_error'
        },
        '409': {
            '$ref': '#/components/responses/409_conflict_error'
        }
    }
}

export const PUT: Operation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dbFieldSearchResult = await getFieldById(Number(req.params.id))
        if (isFieldNorm(req.body)) {
            const dbFieldMeta = createFieldMeta(dbFieldSearchResult)
            if (dbFieldMeta.etag === req.headers['if-match']) {
                const updatedField = await putFieldById(Number(req.params.id), req.body)
                const fieldHeader = createFieldMeta(updatedField)
                res
                    .status(204)
                    .set(fieldHeader)
                    .end()

            } else {
                next(new ApiError(412))
                return
            }
        } else {
            next(new ApiError(400))
            return
        }
    } catch (error) {
        if (error instanceof NotFoundError) {
            next(new ApiError(404, error.message))
            return
        } else {
            throw error
        }
    }
}

PUT.apiSpec = {
    'summary': 'Updates field with id {id}',
    'description': 'Put request on field by id {id}',
    'operationId': 'putFieldById',
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
    'parameters': [
        {
            '$ref': '#/components/parameters/if-match'
        },
        {
            '$ref': '#/components/parameters/id-in-path'
        }
    ],
    'responses': {
        '204': {
            '$ref': '#/components/responses/204_updated'
        },
        '400': {
            '$ref': '#/components/responses/400_validation_error'
        },
        '404': {
            '$ref': '#/components/responses/404_not_found_error'
        },
        '412': {
            '$ref': '#/components/responses/412_precondition_error'
        }
    }
}