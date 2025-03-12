import { CreationOptional, Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize, NonAttribute } from "sequelize"
import { Company } from "./companies.js"

export class CompanyType extends Model<InferAttributes<CompanyType>, InferCreationAttributes<CompanyType>> {
    declare id: CreationOptional<number>
    declare name: string
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

export const initializeCompanyType = (sequelize: Sequelize) => {

    CompanyType.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Typ des Unternehmens',
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
        {
            sequelize,
            modelName: "companyType",
            tableName: "companyTypes"
        }
    )
}
