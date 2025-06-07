import { CreationOptional, Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize, NonAttribute, ForeignKey } from 'sequelize'
import { AddressType } from './addressTypes.js'
import { Country } from './countries.js'
import { Company } from './companies.js'

export class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
    declare id: CreationOptional<number>
    declare street: string
    declare addition?: string
    declare city: string
    declare po: string
    declare addressTypeId: ForeignKey<AddressType['id']>
    declare companyId: ForeignKey<Company['id']>
    declare countryId: ForeignKey<Country['id']>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
    declare country?: NonAttribute<Country>
    declare company?: NonAttribute<Company>
    declare addressType?: NonAttribute<AddressType>
}

export const initializeAddress = (sequelize: Sequelize) => {

    Address.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Street with number',
        },
        addition: {
            type: DataTypes.STRING,
            comment: 'optional: additional information on the address',
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'city',
        },
        po: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Postal code',
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
        {
            sequelize,
            modelName: 'address',
            tableName: 'addresses'
        }
    )
}
