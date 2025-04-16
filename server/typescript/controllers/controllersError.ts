import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types.js'
import { apiSpec } from '../openapi.js'
import { baseLogger } from '../logger.js'

const logger = baseLogger.extend('error')
export interface ApiErrorLike {
  status: number
  message: string
  errors?: unknown[]
}

export function isApiErrorLike(value: unknown): value is ApiErrorLike {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const keys = Object.keys(value)

  return keys.includes('status') && keys.includes('message')
}



export class ApiError extends Error implements ApiErrorLike {

  status: number

  constructor(status: number, message?: string, ...args: ErrorOptions[]) {
    super(message, ...args)
    this.status = status

    const examples = apiSpec.components?.examples
    const errorStatusDefaultMessages: ApiErrorLike[] = []
    if (examples) {
      for (const example in examples) {

        const value: unknown = (examples[example] as OpenAPIV3.ExampleObject).value
        if (isApiErrorLike(value)) {
          errorStatusDefaultMessages.push(value)
        }
      }
    }

    let errorMessage = `${String(status)} Error`
    for (const defaultErrorStatus of errorStatusDefaultMessages) {
      if (status === defaultErrorStatus.status) {
        errorMessage = defaultErrorStatus.message
      }
    }

    this.message = message ?? errorMessage

    logger(this)
  }

}
