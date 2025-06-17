import { DataWithMeta, Meta } from '../../app.js'
import { sha256 } from '../../tests/utils/hasher.js'
import { Country } from '../../models/countries.js'
import { getAllCountries, addCountry } from '../../services/countries.js'
import { NextFunction, Request, Response } from 'express'
import { Operation } from '../../utils/apiSpecAssembler.js'
import { ApiError } from '../controllersError.js'
import { ValidationError } from '../../services/servicesError.js'

export interface CountryNorm {
    name: string
    abbr: string
    isEU: boolean
}

export const isCountryNorm = (value: unknown): value is CountryNorm => {
    if (typeof value === 'object' && value !== null) {
        if (Object.keys(value).includes('name')) return true
    }
    return false
}

export function normalizeCountry(country: Country): CountryNorm {
    const result: CountryNorm = { name: country.name, abbr: country.abbr, isEU: Boolean(country.isEU) }
    return result
}

export function createCountryMeta(country: Country): Meta {
    const countryNorm: CountryNorm = normalizeCountry(country)
    return { 'location': '/countries/' + country.id, 'etag': sha256(JSON.stringify(countryNorm)) }
}

export function combineCountryWithMeta(country: Country): DataWithMeta<CountryNorm> {
    const data: CountryNorm = normalizeCountry(country)
    const meta = createCountryMeta(country)
    return { meta: meta, data: data }
}

export const GET: Operation = async (req: Request, res: Response) => {
    const allCountriesSearchResult = await getAllCountries()
    const allCountriesWithMeta: DataWithMeta<CountryNorm>[] = allCountriesSearchResult.map(row => combineCountryWithMeta(row))
    res
        .status(200)
        .json(allCountriesWithMeta)
}

GET.apiSpec = {
    'summary': 'Get a list of all company types',
    'description': 'GET request on all companies',
    'operationId': 'getCountries',
    'security': [
        { 'openId': [] }
    ],
    'tags': [
        'Country'
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
                                    '$ref': '#/components/schemas/country'
                                }
                            }
                        }
                    },
                    'examples': {
                        'example-of-three-countries': {
                            'value': [
                                {
                                    'meta': {
                                        'location': '/countries/1',
                                        'etag': '656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33850f818a'
                                    },
                                    'data': {
                                        'name': 'Germany',
                                        'abbr': 'DEU',
                                        isEU: true
                                    }
                                },
                                {
                                    'meta': {
                                        'location': '/countries/2',
                                        'etag': '656da9646b5a65673e5a1f504ac3d44232e2da0d939413619ef0fd33850f818a'
                                    },
                                    'data': {
                                        'name': 'Austria',
                                        'abbr': 'AUT',
                                        isEU: true
                                    }
                                },
                                {
                                    'meta': {
                                        'location': '/countries/3',
                                        'etag': '656da9646b5a65673e4a1f504ac3d44262e2da0d939413619ef0fd33850f818a'
                                    },
                                    'data': {
                                        'name': 'China',
                                        'abbr': 'CHN',
                                        isEU: false
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
    if (isCountryNorm(req.body)) {
        try {
            const newCountrySearchResult = await addCountry(req.body)
            const newCountryMeta = createCountryMeta(newCountrySearchResult)
            res
                .status(201)
                .set(newCountryMeta)
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
    'summary': 'Add new company type',
    'description': 'POST request for a new company type',
    'operationId': 'postCountry',
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
