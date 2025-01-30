import { Sequelize } from "sequelize"
import initializeCompany, { Company } from './companies.js'
import initializeCompanytype, { Companytype } from "./companytypes.js"
import baseLogger from "../logger.js"
import setDefaultValues from './default-values.js'

const logger = baseLogger.extend('models:index')
const loggerSequelize = logger.extend('sequelize')
const sequelizeLogger = (sql: any, stuff: any) => loggerSequelize(sql)

if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
    loggerSequelize('No database config found: ', process.env)
    process.exit(1)
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: sequelizeLogger,
    port: Number(process.env.DB_PORT)
})

initializeCompanytype(sequelize)
initializeCompany(sequelize)

Company.belongsTo(Companytype, {
    onDelete: 'NO ACTION'
})
Companytype.hasMany(Company)

try {
    await sequelize.sync({ alter: true })
    logger("Drop and re-sync db.")
} catch (err: any) {
    logger("Failed to sync db: " + err.message)
    throw err
}

try {
    const companytypes = await Companytype.findAll()
    if (companytypes.length === 0) {
        setDefaultValues()
        logger("Default values set")
    } else {
        logger("Default values not set")
    }
} catch (err: any) {
    logger("Failed to set default values")
}

export default sequelize