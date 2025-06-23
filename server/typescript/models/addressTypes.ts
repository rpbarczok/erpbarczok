import { CreationOptional, Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize } from 'sequelize'

export class AddressType extends Model<InferAttributes<AddressType>, InferCreationAttributes<AddressType>> {
    declare id: CreationOptional<number>
    declare name: string
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

export const initializeAddressType = (sequelize: Sequelize) => {

    AddressType.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            comment: 'Type of the Address',
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
        {
            sequelize,
            modelName: 'addressType',
            tableName: 'addressTypes'
        }
    )
}
