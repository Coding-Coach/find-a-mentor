import { HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/functions'
import type { WithId } from 'mongodb'
import type { User } from '../common/interfaces/user.interface';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface AuthUser {
  auth0Id: string
}

export interface AuthContext<U extends User | AuthUser> extends HandlerContext {
  user: U
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

export type ApiHandler<T = any, U extends User | AuthUser = any> = (event: HandlerEventWithBody<T>, context: AuthContext<U>) => Promise<HandlerResponse>

export type CreateRequest<T extends WithId<unknown>> = Omit<T, '_id'>