import {  createNewError} from './error.js'
import { baseLogger } from '../logger.js'
import { Field } from '../models/fields.js'
import { FieldNorm } from '../controllers/fields/index.js'

const logger = baseLogger.extend('services:fields')

export const getAllFields = async () => {
    logger('Get all fields')
    try {
        const fields = await Field.findAll({ order: [['name', 'ASC']] })
        logger('Got all fields')
        return fields
    }
    catch (error) {
        logger('Error while getting all fields')
        return createNewError(500, error.message)
    }
}

export const addField = async (field: FieldNorm) => {
    const newField = {
        name: field.name
    }
    try {
        const addedField = await Field.create(newField)
        return addedField
    } catch (error) {
        return createNewError(500, error.message)
    }
}

export const getFieldById = async (id: number) => {
    try {
        const field = await Field.findByPk(id)
        if (field === null) {
            return createNewError(404)
        } else {
            return field
        }
    }
    catch (error) {
        return createNewError(500, error.message)
    }
}

export const deleteFieldById = async (id: number) => {
    try {
        const deletedRowsCount = await Field.destroy({ where: { id: id } })
        if (deletedRowsCount === 0) {
            return createNewError(404)
        } else {
            return
        }
    }
    catch (error) {
        return createNewError(500, error.message)
    }
}

export const putFieldById = async (id: number, field: FieldNorm) => {
    try {
        const oldField = await Field.findByPk(id)
        if (oldField === null) {
            return createNewError(404)
        } else {
            const updatedField = await oldField.update(field)
            return updatedField
        }
    }
    catch (error) {
        return createNewError(500, error.message)
    }
}