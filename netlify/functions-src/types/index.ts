import { HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/functions'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
  title?: string
  company?: string
  channels?: {
    id: string
    type: string
  }[]
}

export interface AuthContext extends HandlerContext {
  user?: AuthUser
}

export interface BaseResponse {
  statusCode: number
  body: string
  headers?: { [key: string]: string | number | boolean }
}

export interface ErrorResponse extends BaseResponse {
  statusCode: number
  body: string
}

export interface SuccessResponse extends BaseResponse {
  statusCode: number
  body: string
}

export type ApiResponse = Promise<BaseResponse>

export interface PaginationParams {
  page?: string
  limit?: string
}

export interface FilterParams {
  [key: string]: string | string[] | undefined
}

export type ApiHandler = (event: HandlerEvent, context: AuthContext) => Promise<HandlerResponse>