import { DataTypes, Model } from "sequelize";
export class Company extends Model {
}
const initializeCompany = (sequelize) => {
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
        }
    }, {
        sequelize,
        modelName: "Company"
    });
};
export default initializeCompany;
