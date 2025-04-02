import { CreationOptional, Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize } from 'sequelize'

export class Field extends Model<InferAttributes<Field>, InferCreationAttributes<Field>> {
    declare id: CreationOptional<number>
    declare name: string
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

export const initializeField = (sequelize: Sequelize) => {

    Field.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Branchenname',
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
        {
            sequelize,
            modelName: 'field',
            tableName: 'fields'
        }
    )
}
