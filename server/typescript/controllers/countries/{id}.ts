import { getCountryById, deleteCountryById, putCountryById } from '../../services/countries.js'
import { ApiError } from '../controllersError.js'
import type { NextFunction, Request, Response } from 'express'
import { CountryNorm, normalizeCountry, createCountryMeta, isCountryNorm } from './index.js'
import { Operation } from '../../utils/apiSpecAssembler.js'
import { Meta } from '../../app.js'
import { Address } from '../../models/addresses.js'
import { NotFoundError } from '../../services/servicesError.js'
import { ValidationError } from 'sequelize'

export const GET: Operation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const countrySearchResult = await getCountryById(Number(req.params.id))
        const countryNorm: CountryNorm = normalizeCountry(countrySearchResult)
        const countryNormMeta: Meta = createCountryMeta(countrySearchResult)
        res
            .status(200)
            .set(countryNormMeta)
            .json(countryNorm)
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
    'summary': 'Get a certain country',
    'description': 'GET request on a certain country by id {id}',
    'operationId': 'getCountryById',
    'security': [
        { 'openId': [] }
    ],
    'tags': [
        'Country'
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
                        '$ref': '#/components/schemas/country'

                    },
                    'examples': {
                        'country': {
                            '$ref': '#/components/examples/country'
                        }
                    }
                }
            },
            'headers': {
                'etag': {
                    'description': 'Etag of the requested country',
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
            countryId: Number(req.params.id)
        }
    })
    if (count === 0) {
        try {
            await deleteCountryById(Number(req.params.id))
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
    'summary': 'Remove a certain country',
    'description': 'DELETE request on country by id {id}',
    'operationId': 'deleteCountryById',
    'security': [
        {
            'openId': [
                'admin'
            ]
        }
    ],
    'tags': [
        'Country'
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
    if (isCountryNorm(req.body)) {
        try {
            const dbCountrySearchResult = await getCountryById(Number(req.params.id))
            const dbCountryMeta = createCountryMeta(dbCountrySearchResult)
            if (dbCountryMeta.etag === req.headers['if-match']) {
                const updatedCountry = await putCountryById(Number(req.params.id), req.body)
                const countryHeader = createCountryMeta(updatedCountry)
                res
                    .status(204)
                    .set(countryHeader)
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
    'summary': 'Updates country with id {id}',
    'description': 'Put request on country by id {id}',
    'operationId': 'putCountryById',
    'security': [
        {
            'openId': [
                'admin'
            ]
        }
    ],
    'tags': [
        'Country'
    ],
    'requestBody': {
        'description': 'Add country',
        'content': {
            'application/json': {
                'schema': {
                    '$ref': '#/components/schemas/country'
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