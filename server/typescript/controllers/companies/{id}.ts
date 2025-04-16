import { getCompanyById, deleteCompanyById, putCompanyById } from '../../services/companies.js'
import { ApiError, isApiErrorLike } from '../../services/error.js'
import type { Request, Response } from 'express'
import { normalizeCompany, createCompanyMeta, isCompanyNorm } from './index.js'
import { Operation } from '../../utils/apiSpecAssembler.js'
import { Meta } from '../../app.js'



export const GET: Operation = async (req: Request, res: Response) => {
    const result = await getCompanyById(Number(req.params.id))
    if (result instanceof ApiError) {
        res
            .status(result.status)
            .json({ 'status': result.status, 'message': result.message, 'errors': [] })
    } else {
        const companyNorm = normalizeCompany(result)
        const metaHeader: Meta = createCompanyMeta(result)
        res
            .status(200)
            .set(metaHeader)
            .json(companyNorm)
    }
}

GET.apiSpec = {
    'summary': 'Get a certain company',
    'description': 'GET request on a certain company by id {id}',
    'operationId': 'getCompanyById',
    'security': [
        { 'openId': [] }
    ],
    'tags': [
        'Company'
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
                        '$ref': '#/components/schemas/company'
                    },
                    'examples': {
                        'company': {
                            '$ref': '#/components/examples/company'
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

export const DELETE: Operation = async (req: Request, res: Response) => {
    try {
        await deleteCompanyById(Number(req.params.id))
        res
            .status(204)
            .end()
    } catch (error) {
        if (isApiErrorLike(error)) {
            res
                .status(error.status)
                .json({ status: error.status, message: error.message })
        } else {
            throw error
        }
    }
}

DELETE.apiSpec = {
    'summary': 'Remove a certain company',
    'description': 'DELETE request on company by id {id}',
    'operationId': 'deleteCompanyById',
    'security': [
        {
            'openId': [
                'user'
            ]
        }
    ],
    'tags': [
        'Company'
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
    if (isCompanyNorm(req.body)) {
        const oldCompanySearchResult = await getCompanyById(Number(req.params.id))

        if (oldCompanySearchResult instanceof ApiError) {
            res
                .status(oldCompanySearchResult.status)
                .json({ status: oldCompanySearchResult.status, message: oldCompanySearchResult.message })
        } else {
            const oldCompanyWithMeta = createCompanyMeta(oldCompanySearchResult)
            if (oldCompanyWithMeta.etag === req.headers['if-match']) {
                const updatedCompany = await putCompanyById(Number(req.params.id), req.body)
                if (updatedCompany instanceof ApiError) {
                    res
                        .status(updatedCompany.status)
                        .json({ status: updatedCompany.status, message: updatedCompany.message })
                } else {
                    const metaHeader = createCompanyMeta(updatedCompany)
                    res.status(204)
                        .set(metaHeader)
                        .end()
                }
            }
            else {
                const newError = new ApiError(412)
                res
                    .status(newError.status)
                    .json({ status: newError.status, message: newError.message })
            }
        }
    } else {
        const newError = new ApiError(400)
        res
            .status(newError.status)
            .json({ status: newError.status, message: newError.message })
    }

}




PUT.apiSpec = {
    'summary': 'Updates company with id {id}',
    'description': 'Put request on company by id {id}',
    'operationId': 'putCompanyById',
    'security': [
        {
            'openId': [
                'user'
            ]
        }
    ],
    'tags': [
        'Company'
    ],
    'requestBody': {
        'description': 'Add or update company',
        'content': {
            'application/json': {
                'schema': {
                    '$ref': '#/components/schemas/company'
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
