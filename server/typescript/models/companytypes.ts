import { CreationOptional, Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize, NonAttribute } from "sequelize"
import { Company } from "./companies.js"

export class Companytype extends Model<InferAttributes<Companytype, {omit: 'company'}>, InferCreationAttributes<Companytype, {omit: 'company'}>> {
    declare id: CreationOptional<number>
    declare name: string
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
    declare company?: NonAttribute<Company>;
}

const initializeCompanytype = (sequelize: Sequelize) => {

    Companytype.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Typ der Firma',
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
        {
            sequelize,
            modelName: "Companytype"
        }
    )
}


export default initializeCompanytype