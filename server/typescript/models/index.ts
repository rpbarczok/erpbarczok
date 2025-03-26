import { Sequelize } from 'sequelize'
import { initializeCompany, Company } from './companies.js'
import { initializeCompanyType, CompanyType } from './companyTypes.js'
import { baseLogger } from '../logger.js'
import { setDefaultValues } from './default-values.js'
import { Field, initializeField } from './fields.js'

const logger = baseLogger.extend('models:index')
const loggerSequelize = logger.extend('sequelize')
const sequelizeLogger = (sql: any, stuff: any) => loggerSequelize(sql)

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

initializeCompanyType(sequelize)
initializeField(sequelize)
initializeCompany(sequelize)


Company.belongsTo(CompanyType, {
    onDelete: 'NO ACTION'
})
CompanyType.hasMany(Company)

Company.belongsToMany(Field, {through: 'company_fields', onDelete: 'NO ACTION'})
Field.belongsToMany(Company, {through: 'company_fields', onDelete: 'CASCADE'})


try {
    await sequelize.sync({ alter: true })
    logger('Drop and re-sync db.')
} catch (error: any) {
    logger('Failed to sync db: ' + error.message)
    throw error
}

try {
    await setDefaultValues()
} catch (error: any) {
    logger('Failed to set default values')
}
