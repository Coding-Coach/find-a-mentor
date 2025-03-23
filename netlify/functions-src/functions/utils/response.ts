import { ErrorResponse, SuccessResponse, ApiHandler } from '../types'

export function success<T>(data: T, statusCode = 200): SuccessResponse {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, ...data })
  }
}

export function error(message: string, statusCode = 400): ErrorResponse {
  if (process.env.CONTEXT !== 'production') {
    console.error(message);
  }
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify({ success: false, error: message })
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