/*
Copyright (c) 2025 Ralph Barczok
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { baseLogger } from '../logger.js'
import { Field } from '../models/fields.js'
import { FieldNorm } from '../controllers/fields/index.js'
import { NotFoundError, ValidationError } from './servicesError.js'


export const getAllFields = async () => {
    const logger = baseLogger.extend('getAllFields')
    const fields = await Field.findAll({ order: [['name', 'ASC']] })
    logger('Got all fields')
    return fields
}

export const addField = async (field: FieldNorm) => {
    if (field.name) {
        const logger = baseLogger.extend('addField')
        const newField = { name: field.name }
        const addedField = await Field.create(newField)
        logger('Added field.')
        return addedField
    } else throw new ValidationError()

}

export const getFieldById = async (id: number) => {
    const logger = baseLogger.extend('getFieldById')
    const field = await Field.findByPk(id)
    if (field === null) {
        throw new NotFoundError(`Not found: Field with id ${String(id)}.`)
    } else {
        logger(`Got field with id ${String(id)}`)
        return field
    }
}

export const deleteFieldById = async (id: number) => {
    const logger = baseLogger.extend('deleteFieldById')
    const deletedRowsCount = await Field.destroy({ where: { id: id } })
    if (deletedRowsCount === 0) {
        throw new NotFoundError(`Not found: Field with id ${String(id)}.`)
    } else {
        logger(`Deleted field with ${String(id)}`)
        return
    }
}

export const putFieldById = async (id: number, field: FieldNorm): Promise<Field> => {
    const logger = baseLogger.extend('putFieldById')
    if (field.name) {
        const oldField = await Field.findByPk(id)
        if (oldField !== null) {
            const updatedField = await oldField.update(field, { returning: true, where: { id: id } })
            logger(`Updated field with id ${String(id)}`)
            return updatedField
        } else throw new NotFoundError(`Not found: Field with id ${String(id)}.`)
    } else throw new ValidationError()
}