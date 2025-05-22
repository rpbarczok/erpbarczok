import { DataWithMeta, Meta } from '../../app.js'
import { sha256 } from '../../tests/utils/hasher.js'
import { CompanyType } from '../../models/companyTypes.js'
import { getAllCompanyTypes, addCompanyType } from '../../services/companyTypes.js'
import { NextFunction, Request, Response } from 'express'
import { Operation } from '../../utils/apiSpecAssembler.js'
import { ApiError } from '../controllersError.js'
import { ValidationError } from '../../services/servicesError.js'


export interface CompanyTypeNorm {
    name: string
}

export const isCompanyTypeNorm = (value: unknown): value is CompanyTypeNorm => {
    if (typeof value === 'object' && value !== null) {
        if (Object.keys(value).includes('name')) return true
    }
    return false
}

export function normalizeCompanyType(companyType: CompanyType): CompanyTypeNorm {
    const result: CompanyTypeNorm = { name: companyType.name }
    return result
}

export function createCompanyTypeMeta(companyType: CompanyType): Meta {
    const companyTypeNorm: CompanyTypeNorm = normalizeCompanyType(companyType)
    return { 'location': '/company-types/' + companyType.id, 'etag': sha256(JSON.stringify(companyTypeNorm)) }
}

export function combineCompanyTypeWithMeta(companyType: CompanyType): DataWithMeta<CompanyTypeNorm> {
    const data: CompanyTypeNorm = normalizeCompanyType(companyType)
    const meta = createCompanyTypeMeta(companyType)
    return { meta: meta, data: data }
}

export const GET: Operation = async (req: Request, res: Response) => {
    const allCompanyTypesSearchResult = await getAllCompanyTypes()
    const allCompanyTypesWithMeta: DataWithMeta<CompanyTypeNorm>[] = allCompanyTypesSearchResult.map(row => combineCompanyTypeWithMeta(row))
    res
        .status(200)
        .json(allCompanyTypesWithMeta)
}

GET.apiSpec = {
    'summary': 'Get a list of all company types',
    'description': 'GET request on all companies',
    'operationId': 'getCompanyTypes',
    'security': [
        { 'openId': [] }
    ],
    'tags': [
        'CompanyType'
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
                                    '$ref': '#/components/schemas/companyType'
                                }
                            }
                        }
                    },
                    'examples': {
                        'example-of-three-companyTypes': {
                            'value': [
                                {
                                    'meta': {
                                        'location': '/companyTypes/1',
                                        'etag': '656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33850f818a'
                                    },
                                    'data': {
                                        'name': 'Kunde'
                                    }
                                },
                                {
                                    'meta': {
                                        'location': '/companyTypes/2',
                                        'etag': '656da9646b5a65673e5a1f504ac3d44232e2da0d939413619ef0fd33850f818a'
                                    },
                                    'data': {
                                        'name': 'Interessent'
                                    }
                                },
                                {
                                    'meta': {
                                        'location': '/companyTypes/3',
                                        'etag': '656da9646b5a65673e4a1f504ac3d44262e2da0d939413619ef0fd33850f818a'
                                    },
                                    'data': {
                                        'name': 'Spediteur'
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
    if (isCompanyTypeNorm(req.body)) {
        try {
            const newCompanyTypeSearchResult = await addCompanyType(req.body)
            const newCompanyTypeMeta = createCompanyTypeMeta(newCompanyTypeSearchResult)
            res
                .status(201)
                .set(newCompanyTypeMeta)
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
    'operationId': 'postCompanyType',
    'security': [
        {
            'openId': [
                'admin'
            ]
        }
    ],
    'tags': [
        'CompanyType'
    ],
    'requestBody': {
        'description': 'Add company type',
        'content': {
            'application/json': {
                'schema': {
                    '$ref': '#/components/schemas/companyType'
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
