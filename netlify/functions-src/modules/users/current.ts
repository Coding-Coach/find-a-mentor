import { HandlerEvent } from '@netlify/functions'
import { error, success } from '../../utils/response'
import { connectToDatabase, getCollection } from '../../utils/db'
import { ApiHandler, type AuthContext } from '../../types'
import { UserDto } from '../../common/dto/user.dto'
import { Role, User } from '../../common/interfaces/user.interface'
import { ListDto } from '../../lists/dto/list.dto'
import { Template } from '../../email/interfaces/email.interface'
import * as Sentry from '@sentry/node'
import { Auth0Service } from '../../common/auth0.service'
import { EmailService } from '../../common/email.service'
import { withAuth } from '../../utils/auth'

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
      const userDto: UserDto = new UserDto({
        auth0Id: auth0Id,
        email: user.email,
        name: user.nickname,
        avatar: user.picture,
        roles: [Role.MEMBER],
      })
      const newUser = await usersCollection.insertOne(userDto)

      const listsCollection = getCollection<ListDto>('lists')
      const favorites: ListDto = new ListDto({
        name: 'Favorites',
        isFavorite: true,
        user: newUser.insertedId,
        mentors: [],
      })
      await listsCollection.insertOne(favorites)

      const emailService = new EmailService()
      emailService.sendLocalTemplate({
        to: userDto.email,
        name: 'welcome',
        subject: 'Welcome to Coding Coach! 🥳',
        data: {
          name: userDto.name,
        },
      })

      return {
        ...userDto,
        _id: newUser.insertedId,
      }
    }
  }

  return currentUser
}

const getCurrentUserHandler: ApiHandler = async (_event: HandlerEvent, context: AuthContext) => {
  const auth0Id = context.user?.auth0Id;
  if (!auth0Id) {
    return error('Unauthorized: user not found', 401)
  }
  const result = await getCurrentUser(auth0Id)
  return success({ data: result })
}

export const handler = withAuth(getCurrentUserHandler)
