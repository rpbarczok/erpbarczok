import { getAllCompanies, addCompany } from '../../services/companies.js';
export const GET = async (req, res) => res.status(200).json(await getAllCompanies());
export const POST = async (req, res) => res.status(201).set({ location: await addCompany(req.body) }).end();
