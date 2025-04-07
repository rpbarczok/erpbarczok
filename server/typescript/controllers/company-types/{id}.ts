import { getCompanyTypeById, deleteCompanyTypeById, putCompanyTypeById } from '../../services/companyTypes.js'
import { createNewError, ErrorWithStatus } from '../../services/error.js'
import type { Request, Response } from 'express'
import { CompanyTypeNorm, normalizeCompanyType, createCompanyTypeMeta, isCompanyTypeNorm } from './index.js'
import { Operation } from '../../utils/apiSpecAssembler.js'
import { Meta } from '../../app.js'
import { Company } from '../../models/companies.js'

export const GET: Operation = async (req: Request, res: Response) => {

    const companyTypeSearchResult = await getCompanyTypeById(Number(req.params.id))
    if (companyTypeSearchResult instanceof ErrorWithStatus) {
        res
            .status(companyTypeSearchResult.status)
            .json({ status: companyTypeSearchResult.status, message: companyTypeSearchResult.message })
    } else {
        const companyTypeNorm: CompanyTypeNorm = normalizeCompanyType(companyTypeSearchResult)
        const companyTypeNormMeta: Meta = createCompanyTypeMeta(companyTypeSearchResult)
        res
            .status(200)
            .set(companyTypeNormMeta)
            .json(companyTypeNorm)
    }
}

GET.apiSpec = {
    'summary': 'Get a certain companyType',
    'description': 'GET request on a certain companyType by id {id}',
    'operationId': 'getCompanyTypeById',
    'security': [
        { 'openId': [] }
    ],
    'tags': [
        'CompanyType'
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
                        '$ref': '#/components/schemas/companyType'

                    },
                    'examples': {
                        'companyType': {
                            '$ref': '#/components/examples/companyType'
                        }
                    }
                }
            },
            'headers': {
                'etag': {
                    'description': 'Etag of the requested companyType',
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

export const DELETE: Operation = async (req: Request, res: Response) => {
    const { count } = await Company.findAndCountAll({
        where: {
            companyTypeId: Number(req.params.id)
        }
    })
    if (count === 0) {
        const result = await deleteCompanyTypeById(Number(req.params.id))
        if (result instanceof ErrorWithStatus) {
            res.status(result.status).json({ status: result.status, message: result.message })
        }
        res.status(204).end()
    } else {
        res.status(409).json({ status: 409, message: 'Conflict' })
    }

}

DELETE.apiSpec = {
    'summary': 'Remove a certain company type',
    'description': 'DELETE request on company type by id {id}',
    'operationId': 'deleteCompanyTypeById',
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

export const PUT: Operation = async (req: Request, res: Response) => {
    if (isCompanyTypeNorm(req.body)) {
        const dbCompanyTypeSearchResult = await getCompanyTypeById(Number(req.params.id))

        if (dbCompanyTypeSearchResult instanceof ErrorWithStatus) {

            res
                .status(dbCompanyTypeSearchResult.status)
                .json({ status: dbCompanyTypeSearchResult.status, message: dbCompanyTypeSearchResult.message })
        } else {

            const dbCompanyTypeMeta = createCompanyTypeMeta(dbCompanyTypeSearchResult)

            if (dbCompanyTypeMeta.etag === req.headers['if-match']) {

                const updatedCompanyType = await putCompanyTypeById(Number(req.params.id), req.body)

                if (updatedCompanyType instanceof ErrorWithStatus) {

                    res
                        .status(updatedCompanyType.status)
                        .json({ status: updatedCompanyType.status, message: updatedCompanyType.message })

                } else {

                    const companyTypeHeader = createCompanyTypeMeta(updatedCompanyType)

                    res
                        .status(204)
                        .set(companyTypeHeader)
                        .end()
                }

            } else {
                const newError = createNewError(412)
                res
                    .status(newError.status)
                    .json({ status: newError.status, message: newError.message })
            }
        }

    } else {
        const newError = createNewError(400)
        res
            .status(newError.status)
            .json({ status: newError.status, message: newError.message })
    }
}


PUT.apiSpec = {
    'summary': 'Updates company type with id {id}',
    'description': 'Put request on company type by id {id}',
    'operationId': 'putCompanyTypeById',
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
        'description': 'Add companyType',
        'content': {
            'application/json': {
                'schema': {
                    '$ref': '#/components/schemas/companyType'
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