export function error_formatter(status, err) {
    if (process.env.NODE_ENV === 'production' && status === 500) {
        return { status, message: "internal error" };
    }
    if (err.message) {
        return { status, message: err.message };
    }
    if (typeof (err) === "string") {
        return { status, message: err };
    }
    return { status, message: JSON.stringify(err) };
}
export class NotFoundError extends Error {
    constructor(message = "Not Found", ...args) {
        super(message, ...args);
    }
}
