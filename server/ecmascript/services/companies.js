import { error_formatter, NotFoundError } from './error.js';
import { Company } from '../models/companies.js';
function update_company(company) {
    const result = { name: company.name };
    company.abbr !== undefined ? result.abbr = company.abbr : result.abbr = null;
    company.www !== undefined ? result.www = company.www : result.www = null;
    return result;
}
export const getAllCompanies = () => new Promise(async function (resolve, reject) {
    try {
        const companies = await Company.findAll({ order: [['name', 'ASC']] });
        resolve(companies);
    }
    catch (err) {
        reject(error_formatter(500, err));
    }
});
export const addCompany = (body) => new Promise(async function (resolve, reject) {
    const company = { name: body.name };
    if (body.abbr) {
        company.abbr = body.abbr;
    }
    if (body.www) {
        company.www = body.www;
    }
    try {
        const newCompany = await Company.create(company);
        resolve(newCompany.id);
    }
    catch (err) {
        reject(error_formatter(500, err));
    }
});
export const getCompanyById = (id) => new Promise(async function (resolve, reject) {
    try {
        const company = await Company.findByPk(id);
        if (company === null) {
            reject(new NotFoundError());
        }
        else {
            resolve(company);
        }
    }
    catch (err) {
        reject(error_formatter(500, err));
    }
});
export const deleteCompanyById = (id) => new Promise(async (resolve, reject) => {
    try {
        const deletedRowsCount = await Company.destroy({ where: { id: id } });
        if (deletedRowsCount === 0) {
            reject(new NotFoundError);
        }
        else {
            resolve();
        }
    }
    catch (err) {
        reject(error_formatter(500, err));
    }
});
export const putCompanyById = (id, body) => new Promise(async (resolve, reject) => {
    try {
        const company = await Company.findByPk(id);
        if (company === null) {
            reject(new NotFoundError());
        }
        else {
            await company.update(update_company(body));
            resolve();
        }
    }
    catch (err) {
        reject(error_formatter(500, err));
    }
});
