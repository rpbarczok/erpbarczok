/*
Copyright (c) 2025 Ralph Barczok
Portions Copyright (c) 2024 Pan Xuguang GmbH
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { createNewError } from './error.js'
import { baseLogger } from '../logger.js'
import { CompanyType } from '../models/companyTypes.js'
import { CompanyTypeNorm } from '../controllers/company-types/index.js'

const logger = baseLogger.extend('services:companyTypes')

export const getAllCompanyTypes = async () => {
    logger('Get all company types')
    try {
        const companyTypes = await CompanyType.findAll({ order: [['name', 'ASC']] })
        logger('Got all company types')
        return companyTypes
    }
    catch (error) {
        return createNewError(500, error)
    }
}

export const addCompanyType = async (companyType: CompanyTypeNorm) => {
        const newCompanyType = {
            name: companyType.name
        }
        try {
            const addedCompanyType = await CompanyType.create(newCompanyType)
            return addedCompanyType
        } catch (error) {
            return createNewError(500, error)
        }
}

export const getCompanyTypeById = async (id: number) => {
    try {
        const companyType = await CompanyType.findByPk(id)
        if (companyType === null) {
            return createNewError(404)
        } else {
            return companyType
        }
    }
    catch (error) {
        return createNewError(500, error)
    }
}

export const deleteCompanyTypeById = async (id: number) => {
    try {
        const deletedRowsCount = await CompanyType.destroy({ where: { id: id } })
        if (deletedRowsCount === 0) {
            return createNewError(404)
        } else {
            return
        }
    }
    catch (error) {
        return createNewError(500, error)
    }
}

export const putCompanyTypeById = async (id: number, companyType: CompanyTypeNorm) => {
        try {
            const oldCompanyType = await CompanyType.findByPk(id)
            if (oldCompanyType === null) {
                return createNewError(404)
            } else {
                const updatedCompanyType = await oldCompanyType.update(companyType)
                return updatedCompanyType
            }
        }
        catch (error) {
            return createNewError(500, error)
        }
}