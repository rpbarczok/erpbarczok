import { CountryNorm } from '../controllers/countries/index.js'
import { baseLogger } from '../logger.js'
import { Country } from '../models/countries.js'
import { NotFoundError, ValidationError } from './servicesError.js'

export const getAllCountries = async () => {
    const logger = baseLogger.extend('getAllCountries')
    const countries = await Country.findAll({ order: [['name', 'ASC']] })
    logger('Got all countries.')
    return countries
}

export const addCountry = async (country: CountryNorm) => {
    if (country.name) {
        const logger = baseLogger.extend('addCountry')
        const newCountry = { name: country.name, abbr: country.abbr, isEU: country.isEU }
        const addedCountry = await Country.create(newCountry)
        logger('Added new country.')
        return addedCountry
    } else throw new ValidationError()
}

export const getCountryById = async (id: number) => {
    const logger = baseLogger.extend('getCountryById')
    const country = await Country.findByPk(id)
    if (country === null) {
        throw new NotFoundError(`Not found: Country with id ${String(id)}.`)
    } else {
        logger(`Got country with id ${String(id)}`)
        return country
    }
}

export const deleteCountryById = async (id: number) => {
    const logger = baseLogger.extend('deleteCountryById')
    const deletedRowsCount = await Country.destroy({ where: { id: id } })
    if (deletedRowsCount === 0) {
        throw new NotFoundError(`Not found: Country with id ${String(id)}.`)
    } else {
        logger(`Deleted country with id ${String(id)}.`)
        return
    }
}

export const putCountryById = async (id: number, country: CountryNorm) => {
    const logger = baseLogger.extend('putCountryById')
    if (country.name) {
        const oldCountry = await Country.findByPk(id)
        if (oldCountry !== null) {
            const updatedCountry = await oldCountry.update(country)
            logger(`Updated country with id ${String(id)}.`)
            return updatedCountry
        } else throw new NotFoundError(`Not found: Country with id ${String(id)}.`)
    } else throw new ValidationError()
}