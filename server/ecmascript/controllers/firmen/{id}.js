import { getCompanyById, deleteCompanyById, putCompanyById } from '../../services/companies.js';
import { NotFoundError } from "../../services/error.js";
export const GET = async (req, res) => {
    try {
        res.status(200).json(await getCompanyById(Number(req.params.id)));
    }
    catch (err) {
        if (err instanceof NotFoundError)
            res.status(404).json({ "status": 404, "message": "Nicht gefunden" });
        else
            throw err;
    }
};
export const DELETE = async (req, res) => {
    try {
        await deleteCompanyById(Number(req.params.id));
        res.status(204).end();
    }
    catch (err) {
        if (err instanceof NotFoundError)
            res.status(404).json({ status: 404, message: "Nicht gefunden" });
        else
            throw err;
    }
};
export const PUT = async (req, res) => {
    try {
        await putCompanyById(Number(req.params.id), req.body);
        res.status(204).end();
    }
    catch (err) {
        if (err instanceof NotFoundError)
            res.status(404).json({ status: 404, message: "Nicht gefunden" });
        else
            throw err;
    }
};
