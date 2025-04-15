export function createNewError(status: number, error?: unknown): ApiError {
  if (!error) {
    let messageText = 'Error'
    switch (status) {
      case 400:
        messageText = 'Bad request.'
        break
      case 401:
        messageText = 'Unauthorized.'
        break
      case 404:
        messageText = 'not found'
        break
      case 409:
        messageText = 'Conflict'
        break
      case 412:
        messageText = 'Precondition failed.'
        break
      case 418:
        messageText = 'I\'m a teapot.'
        break
      default:
        messageText = 'Unspecified internal error.'
        break
    }
    return new ApiError(status, messageText)
  } else if (typeof error === 'string') {
    if ((error && status !== 500) || (status === 500 && process.env.NODE_ENV !== 'production')) {
      return new ApiError(status, error)
    } else {
      return new ApiError(500, 'Unspecified internal error.')
    }
  } else if (typeof error === 'object') {
    for (const key in error) {
      if (key === 'message') {
        if (typeof error[key] === 'string') {
          const newError = new ApiError(status, error[key])
          return newError
        }
      }
    }
  }
  return new ApiError(500, 'Unspecified internal error.')
}

export interface ErrorWithStatus {
  status: number
  message: string
  errors?: unknown[]
}

export class ApiError extends Error implements ErrorWithStatus {

  constructor(status: number, message: string, ...args: ErrorOptions[]) {
    super(message, ...args)
    this.status = status
  }

  status: number
}
