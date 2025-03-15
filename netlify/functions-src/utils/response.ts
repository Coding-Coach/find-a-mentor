import { ErrorResponse, SuccessResponse, ApiHandler } from '../types'

export const success = <T>(data: T, statusCode = 200): SuccessResponse => ({
  statusCode,
  body: JSON.stringify({ data })
})

export const error = (message: string, statusCode = 400): ErrorResponse => ({
  statusCode,
  body: JSON.stringify({ message })
})

export const withErrorHandling = (handler: ApiHandler): ApiHandler => {
  return async (event, context) => {
    try {
      return await handler(event, context)
    } catch (err) {
      console.error('Error:', err)
      return error(err instanceof Error ? err.message : 'Internal server error', 500)
    }
  }
}