import { DataWithMeta, Meta } from "../../../../app.js"
import { baseLogger } from "../../../../logger.js"
import { Address } from "../../../../models/addresses.js"
import { addAddressToCompany, AddressNorm, getAllAddressesByCompany, isAddressNorm } from "../../../../services/addresses.js"
import { sha256 } from "../../../../tests/utils/hasher.js"
import { AssociationNotFoundError, NotFoundError } from "../../../../services/servicesError.js"
import { Operation } from "../../../../utils/apiSpecAssembler.js"
import { ApiError } from "../../../controllersError.js"
import { NextFunction, Request, Response } from "express"
import { ValidationError } from "sequelize"


const logger = baseLogger.extend('controllers:companies:addresses')

export function normalizeAddress(address: Address) {
    if (address.addressType) {
        if (address.country) {
            const result: AddressNorm = { street: address.street, po: address.po, city: address.city, addressType: address.addressType.name, country: address.country.name }
            if (address.addition) result.addition = address.addition
            return result
        } else {
            throw new Error('address.city must not be empty')
        }
    } else {
        throw new Error('address.addressType must not be empty')
    }

}

export function combineAddressWithMeta(address: Address): DataWithMeta<AddressNorm> {
    const data = normalizeAddress(address)
    const meta: Meta = createAddressMeta(address)
    return { meta: meta, data: data }
}

export function createAddressMeta(address: Address): Meta {
    const addressNorm = normalizeAddress(address)
    return { 'location': '/companies/' + address.companyId + '/addresses/' + address.id, 'etag': sha256(JSON.stringify(addressNorm)) }
}

export const GET: Operation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allAddressesSearchResult = await getAllAddressesByCompany(Number(req.params.id))
        logger('getAllAddressByCompany: %j.', allAddressesSearchResult)
        const allAddressesWithMeta: DataWithMeta<AddressNorm>[] = allAddressesSearchResult.map((row) => (combineAddressWithMeta(row)))
        res
            .status(200)
            .json(allAddressesWithMeta)
    } catch (error) {
        if (error instanceof NotFoundError) {
            next(new ApiError(404, error.message))
        } else {
            throw error
        }
    }

}

GET.apiSpec = {
    'summary': 'Get a list of all addresses of the Company',
    'description': 'GET request on all addresses',
    'operationId': 'getAddresses',
    'security': [
        { 'openId': [] }
    ],
    'tags': [
        'Address'
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
                                    '$ref': '#/components/schemas/address'
                                }
                            }
                        }
                    },
                    'examples': {
                        'example-of-three-companies': {
                            'value': [
                                {
                                    'meta': {
                                        'location': '/companies/1/addresses/1',
                                        'etag': '656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33850f818a'
                                    },
                                    'data': {
                                        'street': 'Poststraße 1',
                                        'po': '1111',
                                        'city': 'Berlin',
                                        'country': 'Deutschland',
                                        'addressType': 'Unternehmensadresse'
                                    }
                                },
                                {
                                    'meta': {
                                        'location': '/companies/1/addresses/2',
                                        'etag': '656da9646b5a65673e4a1f504ac3d44282e2da0d939413619ef0fd33850f818a'
                                    },
                                    'data': {
                                        'street': 'Poststraße 4',
                                        'po': '1111',
                                        'city': 'Berlin',
                                        'country': 'Deutschland',
                                        'addressType': 'Lieferadresse'
                                    }
                                },
                                {
                                    'meta': {
                                        'location': '/companies/1/addresses/3',
                                        'etag': '656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33853f818a'
                                    },
                                    'data': {
                                        'street': 'Schlossallee',
                                        'po': '22222',
                                        'city': 'Hamburg',
                                        'country': 'Deutschland',
                                        'addressType': 'Lieferadresse'
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
        '401': {
            '$ref': '#/components/responses/401_authorization_error'
        }
    }
}

export const POST: Operation = async (req: Request, res: Response, next: NextFunction) => {
    if (isAddressNorm(req.body)) {
        try {
            const newCompanySearchResult = await addAddressToCompany(Number(req.params.id), req.body)
            res.status(204)
                .set(createAddressMeta(newCompanySearchResult))
                .end()
        } catch (error) {
            if (error instanceof AssociationNotFoundError) {
                next(new ApiError(400, error.message))
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

POST.apiSpec = {
    'summary': 'Create new address',
    'description': 'POST request for a new address, response new id',
    'operationId': 'postAddress',
    'security': [
        {
            'openId': [
                'user'
            ]
        }
    ],
    'tags': [
        'Address'
    ],
    'parameters': [
        {
            '$ref': '#/components/parameters/id-in-path'
        }
    ],
    'requestBody': {
        'description': 'Add or update address',
        'content': {
            'application/json': {
                'schema': {
                    '$ref': '#/components/schemas/address'
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
        },
        '401': {
            '$ref': '#/components/responses/401_authorization_error'
        }
    }
}
