import db from "../models/index.js";
import { error_formatter } from './error.js';
const CompanyTypes = db.companyTypes;
export const getAllCompanyTypes = () => new Promise(async function (resolve, reject) {
    try {
        const companyTypes = await CompanyTypes.findAll({ order: [['name', 'ASC']] });
        resolve(companyTypes.map(row => ({ "location": "/firmentypen/" + row.id, "firmentype": { "name": row.name } })));
    }
    catch (err) {
        reject(error_formatter(500, err));
    }
});
export const addCompanyType = (body) => new Promise(async function (resolve, reject) {
    const companyType = {
        name: body.name
    };
    try {
        const newCompanyType = await CompanyTypes.create(companyType);
        resolve('/firmentypen/' + newCompanyType.id);
    }
    catch (err) {
        reject(error_formatter(500, err));
    }
});
