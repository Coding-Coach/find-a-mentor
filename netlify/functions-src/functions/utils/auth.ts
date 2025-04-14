import { HandlerResponse } from '@netlify/functions'
import { ApiHandler } from '../types'
import { error } from './response'
import * as jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import config from '../config'
import { Role } from '../common/interfaces/user.interface'
import { getCurrentUser } from '../modules/users/current'
import { getUserBy } from '../data/users'
import { DataError } from '../data/errors'
import { ErrorCodes } from '../../../../api-types/errorCodes'

const AUTH0_DOMAIN = config.auth0.backend.DOMAIN
const CLIENT_ID = config.auth0.frontend.CLIENT_ID

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

export const verifyToken = async (token: string): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: CLIENT_ID,
        issuer: `https://${AUTH0_DOMAIN}/`,
        algorithms: ['RS256']
      },
      (err, decoded) => {
        if (err) {
          console.error('verifyError:', err)
          reject(new Error('Invalid token'))
        } else {
          resolve(decoded as jwt.JwtPayload)
        }
      }
    )
  })
}

export function withAuth(handler: ApiHandler, options: {
  role?: Role,
  authRequired?: boolean,
  returnUser?: boolean,
  emailVerificationRequired?: boolean
} = {
  role: undefined,
  authRequired: true,
    emailVerificationRequired: true,
  returnUser: false
}): ApiHandler {
  return async (event, context): Promise<HandlerResponse> => {
    try {
      const authHeader = event.headers.authorization
      const { role, authRequired, returnUser, emailVerificationRequired } = options

      if (!authHeader?.startsWith('Bearer ')) {
        if (authRequired) {
          return error('Unauthorized', 401)
        }
        return await handler(event, context)
      }

      const token = authHeader.split(' ')[1]
      const decodedToken = await verifyToken(token)
      if (!decodedToken.sub || decodedToken.aud !== CLIENT_ID || decodedToken.iss !== `https://${AUTH0_DOMAIN}/`) {
        return error('Unauthorized', 401)
      }
      if (emailVerificationRequired && !decodedToken.email_verified) {
        return error('Email is not verified', 403, ErrorCodes.EmailNotVerified)
      }
      context.user = {
        auth0Id: decodedToken.sub,
        // https://chatgpt.com/share/67f93816-4f0c-800c-a8e7-5bbf99d85d4b
        email_verified: decodedToken.email_verified,
      }

      // TODO: instead, set a custom prop on auth0 - is admin to save the call to the database and get it from the token
      // TODO: combine these 2 getCurrentUser calls
      if (role) {
        const currentUser = await getCurrentUser(decodedToken.sub)
        if (!currentUser.roles.includes(role)) {
          return error('Unauthorized', 401)
        }
      }

      if (returnUser && decodedToken.sub) {
        const userDto = await getUserBy('auth0Id', decodedToken.sub)
        if (!userDto) {
          return error('User not found', 404)
        }

        context.user = userDto;
      }

      return await handler(event, context)
    } catch (err) {
      console.error('Error:', err)
      if (err instanceof DataError) {
        return error(err.message, err.statusCode)
      }
      return error('Unauthorized', 401)
    }
  }
}