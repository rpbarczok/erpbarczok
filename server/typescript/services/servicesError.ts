export class AssociationNotFoundError extends Error {
    constructor(message: string) {
        super(`Association not found: ${message}.`)
    }
}

export class NotFoundError extends Error {
    constructor(message = 'Not found error.') {
        super(message)
    }
}

export class ValidationError extends Error {
    constructor(message = 'Bad request.') {
        super(message)
    }
}