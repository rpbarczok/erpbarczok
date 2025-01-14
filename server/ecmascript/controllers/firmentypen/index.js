import { getAllCompanyTypes, addCompanyType } from '../../services/companyTypes.js';
export const GET = async (req, res) => res.status(200).json(await getAllCompanyTypes());
export const POST = async (req, res) => res.status(201).set({ location: await addCompanyType(req.body) }).end();
