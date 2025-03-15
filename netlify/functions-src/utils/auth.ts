import { Handler, HandlerResponse } from '@netlify/functions'
import { AuthUser, ApiHandler } from '../types'
import { error } from './response'
import * as jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || ''
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || ''

const client = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
})

const getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey()
    callback(err, signingKey)
  })
}

export const verifyToken = async (token: string): Promise<AuthUser> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: AUTH0_AUDIENCE,
        issuer: `https://${AUTH0_DOMAIN}/`,
        algorithms: ['RS256']
      },
      (err, decoded) => {
        if (err) {
          reject(new Error('Invalid token'))
        } else {
          resolve(decoded as AuthUser)
        }
      }
    )
  })
}

export const withAuth = (handler: ApiHandler): Handler => {
  return async (event, context): Promise<HandlerResponse> => {
    try {
      const authHeader = event.headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return error('Unauthorized', 401)
      }

      const token = authHeader.split(' ')[1]
      const user = await verifyToken(token)

      return await handler(event, { ...context, user })
    } catch (err) {
      return error('Unauthorized', 401)
    }
  }
}