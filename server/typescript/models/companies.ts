import { DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes, Sequelize, ForeignKey, NonAttribute, BelongsToManyAddAssociationMixin } from 'sequelize'
import { CompanyType } from './companyTypes.js'
import { Field } from './fields.js'
import { Address } from './addresses.js'


export class Company extends Model<InferAttributes<Company>, InferCreationAttributes<Company>> {
    declare id: CreationOptional<number>
    declare name: string
    declare abbr: string | null
    declare www: string | null
    declare companyTypeId: ForeignKey<CompanyType['id']>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
    declare companyType?: NonAttribute<CompanyType>
    declare fields?: NonAttribute<Field[]>
    declare addresses?: NonAttribute<Address[]>
    declare addAddress: BelongsToManyAddAssociationMixin<Address, number>
}

export const initializeCompany = (sequelize: Sequelize) => {
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
            comment: 'Internetadresse Unternehmen'
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
        {
            sequelize,
            modelName: 'company',
            tableName: 'companies'
        }
    )
}
