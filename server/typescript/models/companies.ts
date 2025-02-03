import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes, Sequelize, ForeignKey, NonAttribute } from "sequelize"
import { Companytype } from "./companytypes.js"

export class Company extends Model<InferAttributes<Company>, InferCreationAttributes<Company>> {
    declare id: CreationOptional<number>
    declare name: string
    declare abbr: string | null
    declare www: string | null
    declare companytypeId: ForeignKey<Companytype['id']>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
    declare companytype?: NonAttribute<Companytype>
}

const initializeCompany = (sequelize: Sequelize) => {
    Company.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Genaue Firmierung',
        },
        abbr: {
            type: DataTypes.STRING,
            comment: 'Kürzel: Drei Zeichen für Kunden, Zwei Zeichen für Lieferanten',
        },
        www: {
            type: DataTypes.STRING,
            comment: "Internetadresse der Firma"
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
        {
            sequelize,
            modelName: "company",
            tableName: "companies"
        }
    )
}

export default initializeCompany