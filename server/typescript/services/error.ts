export function error_formatter(status: Number, error: any) {

  if (process.env.NODE_ENV === 'production' && status === 500) {
      return { status, message: 'internal error' }
  }

  if (error.message) {
      return { status, message: error.message }
  }

  if (typeof (error) === 'string') {
      return { status, message: error }
  }

  return { status, message: JSON.stringify(error) }
}

export class NotFoundError extends Error {
  constructor(message = 'Not Found', ...args: any[]) {
      super(message, ...args)
  }
}
