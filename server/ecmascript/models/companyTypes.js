export default (sequelize, Sequelize) => {
    const CompanyType = sequelize.define("companyType", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: 'Typ der Firma',
        }
    });
    return CompanyType;
};
