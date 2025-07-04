import { Request, Response, NextFunction } from "express"
import { deleteAddressById, getAddressById, isAddressNorm, putAddressById } from "../../../../services/addresses.js"
import { createAddressMeta, normalizeAddress } from "./index.js"
import { Meta } from "../../../../app.js"
import { AssociationNotFoundError, NotFoundError } from "../../../../services/servicesError.js"
import { ApiError } from "../../../controllersError.js"
import { Operation } from "../../../../utils/apiSpecAssembler.js"
import { ValidationError } from "sequelize"

export const GET: Operation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getAddressById(Number(req.params.second_id))
        const addressNorm = normalizeAddress(result)
        const metaHeader: Meta = createAddressMeta(result)
        res
            .status(200)
            .set(metaHeader)
            .json(addressNorm)
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
    'summary': 'Get a certain address',
    'description': 'GET request on a certain address by id {second_id}',
    'operationId': 'getAddressById',
    'security': [
        { 'openId': [] }
    ],
    'tags': [
        'Address'
    ],
    'parameters': [
        {
            '$ref': '#/components/parameters/id-in-path'
        },
        {
            '$ref': '#/components/parameters/second_id-in-path'
        }
    ],
    'responses': {
        '200': {
            'description': 'Successful operation',
            'content': {
                'application/json': {
                    'schema': {
                        '$ref': '#/components/schemas/address'
                    },
                    'examples': {
                        'address': {
                            '$ref': '#/components/examples/address'
                        }
                    }
                }
            },
            'headers': {
                'etag': {
                    'description': 'Etag of the requested company',
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
        await deleteAddressById(Number(req.params.second_id))
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
    'summary': 'Remove a certain address',
    'description': 'DELETE request on address by id {second_id}',
    'operationId': 'deleteCompanyById',
    'security': [
        {
            'openId': [
                'user'
            ]
        }
    ],
    'tags': [
        'address'
    ],
    'parameters': [
        {
            '$ref': '#/components/parameters/id-in-path'
        },
        {
            '$ref': '#/components/parameters/second_id-in-path'
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
    if (isAddressNorm(req.body)) {
        try {
            const oldAddressSearchResult = await getAddressById(Number(req.params.second_id))
            const oldAddressWithMeta = createAddressMeta(oldAddressSearchResult)

            if (oldAddressWithMeta.etag === req.headers['if-match']) {
                const updatedAddress = await putAddressById(Number(req.params.second_id), req.body)
                const metaHeader = createAddressMeta(updatedAddress)
                res.status(204)
                    .set(metaHeader)
                    .end()
            }
            else {
                next(new ApiError(412))
                return
            }
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof AssociationNotFoundError) {
                next(new ApiError(404, error.message))
                return
            } else if (error instanceof ValidationError) {
                next(new ApiError(400, error.message))
                return
            }
            throw error
        }
    } else {
        next(new ApiError(400))
    }
}




PUT.apiSpec = {
    'summary': 'Updates address with id {second_id}',
    'description': 'Put request on address by id {second_id}',
    'operationId': 'putAddressById',
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
    'parameters': [
        {
            '$ref': '#/components/parameters/if-match'
        },
        {
            '$ref': '#/components/parameters/id-in-path'
        },
                {
            '$ref': '#/components/parameters/second_id-in-path'
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
