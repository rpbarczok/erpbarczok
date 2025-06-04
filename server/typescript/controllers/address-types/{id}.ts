import { getAddressTypeById, deleteAddressTypeById, putAddressTypeById } from '../../services/addressTypes.js'
import { ApiError } from '../controllersError.js'
import type { NextFunction, Request, Response } from 'express'
import { AddressTypeNorm, normalizeAddressType, createAddressTypeMeta, isAddressTypeNorm } from './index.js'
import { Operation } from '../../utils/apiSpecAssembler.js'
import { Meta } from '../../app.js'
import { Address } from '../../models/addresses.js'
import { NotFoundError } from '../../services/servicesError.js'
import { ValidationError } from 'sequelize'

export const GET: Operation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const addressTypeSearchResult = await getAddressTypeById(Number(req.params.id))
        const addressTypeNorm: AddressTypeNorm = normalizeAddressType(addressTypeSearchResult)
        const addressTypeNormMeta: Meta = createAddressTypeMeta(addressTypeSearchResult)
        res
            .status(200)
            .set(addressTypeNormMeta)
            .json(addressTypeNorm)
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
    'summary': 'Get a certain addressType',
    'description': 'GET request on a certain addressType by id {id}',
    'operationId': 'getAddressTypeById',
    'security': [
        { 'openId': [] }
    ],
    'tags': [
        'AddressType'
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
                        '$ref': '#/components/schemas/addressType'

                    },
                    'examples': {
                        'addressType': {
                            '$ref': '#/components/examples/addressType'
                        }
                    }
                }
            },
            'headers': {
                'etag': {
                    'description': 'Etag of the requested addressType',
                    'schema': {
                        '$ref': '#/components/schemas/etag'
                    }
                }
            }
        },
        '400': {
            '$ref': '#/components/responses/400_validation_error'
        },
        '404': {
            '$ref': '#/components/responses/404_not_found_error'
        }
    }
}

export const DELETE: Operation = async (req: Request, res: Response, next: NextFunction) => {
    const { count } = await Address.findAndCountAll({
        where: {
            addressTypeId: Number(req.params.id)
        }
    })
    if (count === 0) {
        try {
            await deleteAddressTypeById(Number(req.params.id))
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
    } else {
        throw new ApiError(409)
    }

}

DELETE.apiSpec = {
    'summary': 'Remove a certain address type',
    'description': 'DELETE request on address type by id {id}',
    'operationId': 'deleteAddressTypeById',
    'security': [
        {
            'openId': [
                'admin'
            ]
        }
    ],
    'tags': [
        'AddressType'
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
    if (isAddressTypeNorm(req.body)) {
        try {
            const dbAddressTypeSearchResult = await getAddressTypeById(Number(req.params.id))
            const dbAddressTypeMeta = createAddressTypeMeta(dbAddressTypeSearchResult)
            if (dbAddressTypeMeta.etag === req.headers['if-match']) {
                const updatedAddressType = await putAddressTypeById(Number(req.params.id), req.body)
                const addressTypeHeader = createAddressTypeMeta(updatedAddressType)
                res
                    .status(204)
                    .set(addressTypeHeader)
                    .end()
            } else {
                next(new ApiError(412))
                return
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                next(new ApiError(404, error.message))
                return
            } else if (error instanceof ValidationError) {
                next(new ApiError(400, error.message))
                return
            } else {
                throw error
            }
        }
    } else {
        next(new ApiError(400))
        return
    }
}


PUT.apiSpec = {
    'summary': 'Updates address type with id {id}',
    'description': 'Put request on address type by id {id}',
    'operationId': 'putAddressTypeById',
    'security': [
        {
            'openId': [
                'admin'
            ]
        }
    ],
    'tags': [
        'AddressType'
    ],
    'requestBody': {
        'description': 'Add addressType',
        'content': {
            'application/json': {
                'schema': {
                    '$ref': '#/components/schemas/addressType'
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
        '401': {
            '$ref': '#/components/responses/401_authorization_error'
        },
        '404': {
            '$ref': '#/components/responses/404_not_found_error'
        },
        '412': {
            '$ref': '#/components/responses/412_precondition_error'
        }
    }
}