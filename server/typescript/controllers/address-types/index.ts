import { DataWithMeta, Meta } from '../../app.js'
import { sha256 } from '../../tests/utils/hasher.js'
import { AddressType } from '../../models/addressTypes.js'
import { getAllAddressTypes, addAddressType } from '../../services/addressTypes.js'
import { NextFunction, Request, Response } from 'express'
import { Operation } from '../../utils/apiSpecAssembler.js'
import { ApiError } from '../controllersError.js'
import { ValidationError } from '../../services/servicesError.js'


export interface AddressTypeNorm {
    name: string
}

export const isAddressTypeNorm = (value: unknown): value is AddressTypeNorm => {
    if (typeof value === 'object' && value !== null) {
        if (Object.keys(value).includes('name')) return true
    }
    return false
}

export function normalizeAddressType(addressType: AddressType): AddressTypeNorm {
    const result: AddressTypeNorm = { name: addressType.name }
    return result
}

export function createAddressTypeMeta(addressType: AddressType): Meta {
    const addressTypeNorm: AddressTypeNorm = normalizeAddressType(addressType)
    return { 'location': '/address-types/' + addressType.id, 'etag': sha256(JSON.stringify(addressTypeNorm)) }
}

export function combineAddressTypeWithMeta(addressType: AddressType): DataWithMeta<AddressTypeNorm> {
    const data: AddressTypeNorm = normalizeAddressType(addressType)
    const meta = createAddressTypeMeta(addressType)
    return { meta: meta, data: data }
}

export const GET: Operation = async (req: Request, res: Response) => {
    const allAddressTypesSearchResult = await getAllAddressTypes()
    const allAddressTypesWithMeta: DataWithMeta<AddressTypeNorm>[] = allAddressTypesSearchResult.map(row => combineAddressTypeWithMeta(row))
    res
        .status(200)
        .json(allAddressTypesWithMeta)
}

GET.apiSpec = {
    'summary': 'Get a list of all address types',
    'description': 'GET request on all companies',
    'operationId': 'getAddressTypes',
    'security': [
        { 'openId': [] }
    ],
    'tags': [
        'AddressType'
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
                                    '$ref': '#/components/schemas/addressType'
                                }
                            }
                        }
                    },
                    'examples': {
                        'example-of-three-addressTypes': {
                            'value': [
                                {
                                    'meta': {
                                        'location': '/address-types/1',
                                        'etag': '656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33850f818a'
                                    },
                                    'data': {
                                        'name': 'Unternehmensadresse'
                                    }
                                },
                                {
                                    'meta': {
                                        'location': '/address-types/2',
                                        'etag': '656da9646b5a65673e5a1f504ac3d44232e2da0d939413619ef0fd33850f818a'
                                    },
                                    'data': {
                                        'name': 'Rechnungsadresse'
                                    }
                                },
                                {
                                    'meta': {
                                        'location': '/address-types/3',
                                        'etag': '656da9646b5a65673e4a1f504ac3d44262e2da0d939413619ef0fd33850f818a'
                                    },
                                    'data': {
                                        'name': 'Lieferadresse'
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

export const POST: Operation = async (req: Request, res: Response, next: NextFunction) => {
    if (isAddressTypeNorm(req.body)) {
        try {
            const newAddressTypeSearchResult = await addAddressType(req.body)
            const newAddressTypeMeta = createAddressTypeMeta(newAddressTypeSearchResult)
            res
                .status(201)
                .set(newAddressTypeMeta)
                .end()
        } catch (error) {
            if (error instanceof ValidationError) {
                next(new ApiError(400, error.message))
            } else {
                throw error
            }
        }

    } else {
        next(new ApiError(400))
        return
    }
}

POST.apiSpec = {
    'summary': 'Add new address type',
    'description': 'POST request for a new address type',
    'operationId': 'postAddressType',
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
        'description': 'Add address type',
        'content': {
            'application/json': {
                'schema': {
                    '$ref': '#/components/schemas/addressType'
                }
            }
        }
    },
    'responses': {
        '201': {
            '$ref': '#/components/responses/201'
        },
        '400': {
            '$ref': '#/components/responses/400_validation_error'
        }, '401': {
            '$ref': '#/components/responses/401_authorization_error'
        }
    }
}
