import type { ErrorCodes } from '../../../../api-types/errorCodes';
import { ErrorResponse, SuccessResponse, ApiHandler } from '../types'

type SuccessPayload<T> = {
  [key: string]: any;
  data: T;
}

export function success<T>(data: SuccessPayload<T>, statusCode = 200): SuccessResponse {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, ...data })
  }
}

export function error(message: string, statusCode = 400, errorCode?: ErrorCodes): ErrorResponse {
  if (process.env.CONTEXT !== 'production') {
    console.error('===== error ======', message);
  }

  const response =  {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify({ success: false, error: message, errorCode })
  }
  return response;
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