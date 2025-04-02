export function createNewError(status: number, message?: string): ErrorWithStatus {
  if ((message && status !== 500) || (status === 500 && process.env.NODE_ENV !== 'production')) {
    return new ErrorWithStatus(status, message)
  } else {
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
    const error = new ErrorWithStatus(status, messageText)
    return error
  }
}


export class ErrorWithStatus extends Error {

  constructor(status: number, message: string, ...args: unknown[]) {
    super(message, ...args)
    this.status = status
  }

  status: number
}
