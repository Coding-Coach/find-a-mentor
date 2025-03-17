import { HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/functions'

export interface AuthUser {
  auth0Id: string
  id: string
  // email: string
  // name?: string
  // avatar?: string
  // title?: string
  // channels?: {
  //   id: string
  //   type: string
  // }[]
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
  page: number
  total: number
  hasMore: boolean
}

export interface FilterParams {
  [key: string]: string | string[] | undefined
}

export type ApiHandler = (event: HandlerEvent, context: AuthContext) => Promise<HandlerResponse>