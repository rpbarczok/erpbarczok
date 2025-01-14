import { CreationOptional, Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize } from "sequelize"

export class Companytype extends Model<InferAttributes<Companytype>, InferCreationAttributes<Companytype>> {
    declare id: CreationOptional<number>
    declare name:string
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
        }
    },
        {
            sequelize,
            modelName: "Companytype"
        }
    )
}


export default initializeCompanytype