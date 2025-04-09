import { HandlerEvent } from '@netlify/functions'
import { error, success } from '../../utils/response'
import { connectToDatabase, getCollection } from '../../utils/db'
import { ApiHandler, type AuthContext } from '../../types'
import { UserDto } from '../../common/dto/user.dto'
import { Role, User } from '../../common/interfaces/user.interface'
// TODO: import * as Sentry from '@sentry/node'
import { Auth0Service } from '../../common/auth0.service'
import { withAuth } from '../../utils/auth'
import { send } from '../../email/client'
import { upsertUser } from '../../data/users'

export const getCurrentUser = async (auth0Id: string): Promise<any> => {
  await connectToDatabase()
  const usersCollection = getCollection<User>('users')
  const currentUser = await usersCollection.findOne({ auth0Id })

  if (!currentUser) {
    // ...existing code for fetching user from Auth0 and handling new user creation...
    const auth0Service = new Auth0Service()
    const data: any = await auth0Service.getAdminAccessToken()
    const user: any = await auth0Service.getUserProfile(data.access_token, auth0Id)

    const existingMentor = await usersCollection.findOne({ email: user.email })
    if (existingMentor) {
      const userDto: UserDto = new UserDto({
        _id: existingMentor._id,
        auth0Id,
      })
      await usersCollection.updateOne({ _id: existingMentor._id }, { $set: userDto })
      return existingMentor
    } else {
      const newUser = await upsertUser({
        auth0Id,
        email: user.email,
        name: user.nickname,
        avatar: user.picture,
        roles: [Role.MEMBER],
        createdAt: new Date(),
        spokenLanguages: [],
        tags: [],
        channels: [],
      })

      send({
        to: user.email,
        name: 'welcome',
        subject: 'Welcome to Coding Coach! 🥳',
        data: {
          name: user.nickname,
        },
      })

      return newUser;
    }
  }

  return currentUser
}

const getCurrentUserHandler: ApiHandler = async (_event: HandlerEvent, context: AuthContext<User>) => {
  const auth0Id = context.user?.auth0Id;
  if (!auth0Id) {
    return error('Unauthorized: user not found', 401)
  }
  const result = await getCurrentUser(auth0Id)
  return success({ data: result })
}

export const handler = withAuth(getCurrentUserHandler)
