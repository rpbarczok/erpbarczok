import { Sequelize } from 'sequelize'
import { initializeCompany, Company } from './companies.js'
import { initializeCompanyType, CompanyType } from './companyTypes.js'
import { baseLogger } from '../logger.js'
import { Field, initializeField } from './fields.js'
import { AddressType, initializeAddressType } from './addressTypes.js'
import { Country, initializeCountry } from './countries.js'
import { Address, initializeAddress } from './addresses.js'

const logger = baseLogger.extend('models:index')
const loggerSequelize = logger.extend('sequelize')
const sequelizeLogger = (sql: unknown) => {loggerSequelize(sql)}

if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
    loggerSequelize('No database config found: ', process.env)
    process.exit(1)
}

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: sequelizeLogger,
    port: Number(process.env.DB_PORT)
})

initializeAddressType(sequelize)
initializeCountry(sequelize)
initializeAddress(sequelize)

Address.belongsTo(AddressType, {
    onDelete: 'NO ACTION'
})
AddressType.hasMany(Address)

Address.belongsTo(Country, {
    onDelete: "NO ACTION"
})
Country.hasMany(Address)

initializeCompanyType(sequelize)
initializeField(sequelize)
initializeCompany(sequelize)

Company.belongsTo(CompanyType, {
    onDelete: 'NO ACTION'
})
CompanyType.hasMany(Company)

Company.belongsToMany(Field, {through: 'company_fields', onDelete: 'CASCADE'})
Field.belongsToMany(Company, {through: 'company_fields', onDelete: 'NO ACTION'})

Company.hasMany(Address, {onDelete: 'CASCADE'})
Address.belongsTo(Company)
