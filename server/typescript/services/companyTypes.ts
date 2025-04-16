/*
Copyright (c) 2025 Ralph Barczok
Portions Copyright (c) 2024 Pan Xuguang GmbH
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { baseLogger } from '../logger.js'
import { CompanyType } from '../models/companyTypes.js'
import { CompanyTypeNorm } from '../controllers/company-types/index.js'
import { ApiError, isApiErrorLike } from '../controllers/controllersError.js'

export const getAllCompanyTypes = async () => {
    const logger = baseLogger.extend('getAllCompanyTypes')
    try {
        const companyTypes = await CompanyType.findAll({ order: [['name', 'ASC']] })
        logger('Got all company types.')
        return companyTypes
    }
    catch (error) {
        logger(error)
        if (isApiErrorLike(error)) {
            throw new ApiError(error.status, error.message)
        } else {
            throw error
        }
    }
}

export const addCompanyType = async (companyType: CompanyTypeNorm) => {
    const logger = baseLogger.extend('addCompanyType')
        const newCompanyType = {
            name: companyType.name
        }
        try {
            const addedCompanyType = await CompanyType.create(newCompanyType)
            logger('Added new company type.')
            return addedCompanyType
        } catch (error) {
            logger(error)
            if (isApiErrorLike(error)) {
                throw new ApiError(error.status, error.message)
            } else {
                throw error
            }
        }
}

export const getCompanyTypeById = async (id: number) => {
    const logger = baseLogger.extend('getCompanyTypeById')
    try {
        const companyType = await CompanyType.findByPk(id)
        if (companyType === null) {
            const newError =new ApiError(404)
            logger(newError)
            throw newError
        } else {
            logger(`Got company type with id ${String(id)}`)
            return companyType
        }
    }
    catch (error) {
        logger(error)
        if (isApiErrorLike(error)) {
            throw new ApiError(error.status, error.message)
        } else {
            throw error
        }
    }
}

export const deleteCompanyTypeById = async (id: number) => {
    const logger = baseLogger.extend('deleteCompanyTypeById')
    try {
        const deletedRowsCount = await CompanyType.destroy({ where: { id: id } })
        if (deletedRowsCount === 0) {
            const newError =new ApiError(404)
            logger(newError)
            throw newError
        } else {
            logger(`Deleted company type with id ${String(id)}.`)
            return
        }
    }
    catch (error) {
        logger(error)
        if (isApiErrorLike(error)) {
            throw new ApiError(error.status, error.message)
        } else {
            throw error
        }
    }
}

export const putCompanyTypeById = async (id: number, companyType: CompanyTypeNorm) => {
    const logger = baseLogger.extend('puCompanyTypeById')
        try {
            const oldCompanyType = await CompanyType.findByPk(id)
            if (oldCompanyType === null) {
                const newError =new ApiError(404)
                logger(newError)
                throw newError
            } else {
                const updatedCompanyType = await oldCompanyType.update(companyType)
                logger(`Updated company type with id ${String(id)}.`)
                return updatedCompanyType
            }
        }
        catch (error) {
            logger(error)
            if (isApiErrorLike(error)) {
                throw new ApiError(error.status, error.message)
            } else {
                throw error
            }
        }
}