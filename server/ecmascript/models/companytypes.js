import { Model, DataTypes } from "sequelize";
export class Companytype extends Model {
}
const initializeCompanytype = (sequelize) => {
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
    }, {
        sequelize,
        modelName: "Companytype"
    });
};
export default initializeCompanytype;
