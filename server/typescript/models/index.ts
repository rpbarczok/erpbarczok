import { Sequelize, Dialect, Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize"
import initializeCompany, { Company} from './companies.js'
import initializeCompanytype, {Companytype} from "./companytypes.js"
import baseLogger from "../logger.js"

const logger = baseLogger.extend('models:index')
const loggerSequelize = logger.extend('sequelize')
const sequelizeLogger = (sql: any, stuff: any) => loggerSequelize(sql)

if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST || !process.env.DB_DIALECT) {
    console.log('No database config found: ', process.env)
    process.exit(1)
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as Dialect,
    logging: sequelizeLogger
})

initializeCompanytype(sequelize)
initializeCompany(sequelize)

Company.belongsTo(Companytype)
Companytype.hasMany(Company)

try {
    await sequelize.sync({ alter: true })
    logger("Drop and re-sync db.")
} catch (err: any) {
    logger("Failed to sync db: " + err.message)
    throw err
}

export default sequelize