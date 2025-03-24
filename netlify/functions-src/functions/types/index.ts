import { HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/functions'
import type { WithId } from 'mongodb'

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

export type HandlerEventWithBody<T = undefined> = HandlerEvent & { parsedBody?: T }

export type ApiHandler<T extends unknown = undefined> = (event: HandlerEventWithBody<T>, context: AuthContext) => Promise<HandlerResponse>

export type CreateRequest<T extends WithId<unknown>> = Omit<T, '_id'>