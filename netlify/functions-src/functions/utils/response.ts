import { ErrorResponse, SuccessResponse, ApiHandler } from '../types'

export function success<T>(data: T, statusCode = 200): SuccessResponse {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, ...data })
  }
}

export function error(message: string, statusCode = 400): ErrorResponse {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: false, message })
  }
}

export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (event, context) => {
    try {
      return await handler(event, context)
    } catch (err) {
      console.error('Error:', err)
      return error(err instanceof Error ? err.message : 'Internal server error', 500)
    }
  }
}