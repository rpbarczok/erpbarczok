import { ApiError, isApiErrorLike } from '../controllers/controllersError.js'
import { baseLogger } from '../logger.js'
import { Field } from '../models/fields.js'
import { FieldNorm } from '../controllers/fields/index.js'

export const getAllFields = async () => {
    const logger = baseLogger.extend('getAllFields')
    try {
        const fields = await Field.findAll({ order: [['name', 'ASC']] })
        logger('Got all fields')
        return fields
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

export const addField = async (field: FieldNorm) => {
    const logger = baseLogger.extend('addField')
    const newField = {
        name: field.name
    }
    try {
        const addedField = await Field.create(newField)
        logger('Added field.')
        return addedField
    } catch (error) {
        logger(error)
        if (isApiErrorLike(error)) {
            throw new ApiError(error.status, error.message)
        } else {
            throw error
        }
    }
}

export const getFieldById = async (id: number) => {
    const logger = baseLogger.extend('getFieldById')
    try {
        const field = await Field.findByPk(id)
        if (field === null) {
            const newError =new ApiError(404)
            logger(newError)
            throw newError
        } else {
            logger(`Got field with id ${String(id)}`)
            return field
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

export const deleteFieldById = async (id: number) => {
    const logger = baseLogger.extend('deleteFieldById')
    try {
        const deletedRowsCount = await Field.destroy({ where: { id: id } })
        if (deletedRowsCount === 0) {
            const newError =new ApiError(404)
            logger(newError)
            throw newError
        } else {
            logger(`Deleted field with ${String(id)}`)
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

export const putFieldById = async (id: number, field: FieldNorm): Promise<Field | ApiError> => {
    const logger = baseLogger.extend('putFieldById')
    try {
        const oldField = await Field.findByPk(id)
        if (oldField === null) {
            const newError =new ApiError(404)
            logger(newError)
            throw newError
        } else {
            const updatedField = await oldField.update(field)
            logger(`Updated field with id ${String(id)}`)
            return updatedField
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