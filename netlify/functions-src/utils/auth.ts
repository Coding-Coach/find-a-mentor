import { Handler, HandlerResponse } from '@netlify/functions'
import { ApiHandler } from '../types'
import { error } from './response'
import * as jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import config from '../config'
import { Role } from '../common/interfaces/user.interface'
import { getCurrentUser } from '../modules/users/current'

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

// const verifyToken = async (token: string): Promise<AuthUser> => {
//   const decoded = jwt.verify(token, config.auth0.backend.CLIENT_SECRET || config.auth0.backend.DOMAIN); // Verify token
//   return (decoded as jwt.JwtPayload).payload as AuthUser;
// }

export const withAuth = (handler: ApiHandler, role?: Role): Handler => {
  return async (event, context): Promise<HandlerResponse> => {
    try {
      const authHeader = event.headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return error('Unauthorized', 401)
      }

      const token = authHeader.split(' ')[1]
      const decodedToken = await verifyToken(token)

      // TODO: instead, set a custom prop on auth0 - is admin to save the call to the database and get it from the token
      if (role) {
        const currentUser = await getCurrentUser(decodedToken.sub as string)
        if (!currentUser.roles.includes(role)) {
          return error('Unauthorized', 401)
        }
      }

      return await handler(event, {
        ...context,
        user: {
          id: decodedToken.sub as string,
          auth0Id: decodedToken.sub as string,
        }
       })
    } catch (err) {
      console.error('Error:', err)
      return error('Unauthorized', 401)
    }
  }
}