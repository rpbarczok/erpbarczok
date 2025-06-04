import { CreationOptional, Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize} from 'sequelize'

export class Country extends Model<InferAttributes<Country>, InferCreationAttributes<Country>> {
    declare id: CreationOptional<number>
    declare name: string
    declare abbr: string
    declare isEU: boolean
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

export const initializeCountry = (sequelize: Sequelize) => {

    Country.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Name of the country',
        },
        abbr: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Abbreviation according to ISO 3166-1 A-3'
        },
        isEU: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Is the country part of the EFTA'
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
        {
            sequelize,
            modelName: 'country',
            tableName: 'countries'
        }
    )
}
