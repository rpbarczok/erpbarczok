import { error_formatter, NotFoundError } from './error.js';
import baseLogger from "../logger.js";
import { Companytype } from "../models/companytypes.js";
const logger = baseLogger.extend("services:companytypes");
export const getAllCompanytypes = () => new Promise(async function (resolve, reject) {
    try {
        const companytypes = await Companytype.findAll({ order: [['name', 'ASC']] });
        logger(companytypes);
        resolve(companytypes);
    }
    catch (err) {
        reject(error_formatter(500, err));
    }
});
export const addCompanytype = (body) => new Promise(async function (resolve, reject) {
    const companytype = {
        name: body.name
    };
    try {
        const newCompanytype = await Companytype.create(companytype);
        resolve(newCompanytype.id);
    }
    catch (err) {
        reject(error_formatter(500, err));
    }
});
export const getCompanytypeById = (id) => new Promise(async function (resolve, reject) {
    try {
        const companytype = await Companytype.findByPk(id);
        if (companytype === null) {
            reject(new NotFoundError());
        }
        else {
            resolve(companytype);
        }
    }
    catch (err) {
        reject(error_formatter(500, err));
    }
});
export const deleteCompanytypeById = (id) => new Promise(async (resolve, reject) => {
    try {
        const deletedRowsCount = await Companytype.destroy({ where: { id: id } });
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
export const putCompanytypeById = (id, body) => new Promise(async (resolve, reject) => {
    try {
        const companytype = await Companytype.findByPk(id);
        if (companytype === null) {
            reject(new NotFoundError());
        }
        else {
            await companytype.update(body);
            resolve();
        }
    }
    catch (err) {
        reject(error_formatter(500, err));
    }
});
