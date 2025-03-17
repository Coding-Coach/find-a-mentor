import { ErrorResponse, SuccessResponse, ApiHandler } from '../types'

export const success = <T>(data: T, statusCode = 200): SuccessResponse => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ success: true, ...data })
})

export const error = (message: string, statusCode = 400): ErrorResponse => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ success: false, message })
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