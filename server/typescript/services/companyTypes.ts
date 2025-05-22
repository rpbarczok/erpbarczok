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
import { NotFoundError, ValidationError } from './servicesError.js'

export const getAllCompanyTypes = async () => {
    const logger = baseLogger.extend('getAllCompanyTypes')
    const companyTypes = await CompanyType.findAll({ order: [['name', 'ASC']] })
    logger('Got all company types.')
    return companyTypes
}

export const addCompanyType = async (companyType: CompanyTypeNorm) => {
    if (companyType.name) {
        const logger = baseLogger.extend('addCompanyType')
        const newCompanyType = { name: companyType.name }
        const addedCompanyType = await CompanyType.create(newCompanyType)
        logger('Added new company type.')
        return addedCompanyType
    } else throw new ValidationError()
}

export const getCompanyTypeById = async (id: number) => {
    const logger = baseLogger.extend('getCompanyTypeById')
    const companyType = await CompanyType.findByPk(id)
    if (companyType === null) {
        throw new NotFoundError(`Not found: Company type with id ${String(id)}.`)
    } else {
        logger(`Got company type with id ${String(id)}`)
        return companyType
    }
}

export const deleteCompanyTypeById = async (id: number) => {
    const logger = baseLogger.extend('deleteCompanyTypeById')
    const deletedRowsCount = await CompanyType.destroy({ where: { id: id } })
    if (deletedRowsCount === 0) {
        throw new NotFoundError(`Not found: Company type with id ${String(id)}.`)
    } else {
        logger(`Deleted company type with id ${String(id)}.`)
        return
    }
}

export const putCompanyTypeById = async (id: number, companyType: CompanyTypeNorm) => {
    const logger = baseLogger.extend('puCompanyTypeById')
    if (companyType.name) {
        const oldCompanyType = await CompanyType.findByPk(id)
        if (oldCompanyType !== null) {
            const updatedCompanyType = await oldCompanyType.update(companyType)
            logger(`Updated company type with id ${String(id)}.`)
            return updatedCompanyType
        } else throw new NotFoundError(`Not found: Company type with id ${String(id)}.`)
    } else throw new ValidationError()
}