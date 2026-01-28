import { HandlerEvent } from '@netlify/functions'
import { error, success } from '../../utils/response'
import { ApiHandler, type AuthContext } from '../../types'
import { UserDto } from '../../common/dto/user.dto'
import { Role, type ApplicationUser, type User } from '../../common/interfaces/user.interface'
// TODO: import * as Sentry from '@sentry/node'
import { auth0Service } from '../../common/auth0.service'
import { withAuth } from '../../utils/auth'
import { getUserBy, upsertUser } from '../../data/users'

export const getCurrentUser = async (auth0Id: string): Promise<User> => {
  const currentUser = await getUserBy('auth0Id', auth0Id);
  if (!currentUser) {
    // ...existing code for fetching user from Auth0 and handling new user creation...
    const user = await auth0Service.getUserProfile(auth0Id)

    const existingMentor = await getUserBy('email', user.email)
    if (existingMentor) {
      const userDto: UserDto = new UserDto({
        _id: existingMentor._id,
        auth0Id,
      })
      await upsertUser(userDto);
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

      // no need to send the email. it's sent by auth0 as part of the email verification process
      // send({
      //   to: user.email,
      //   name: 'welcome',
      //   subject: 'Welcome to Coding Coach! 🥳',
      //   data: {
      //     name: user.nickname,
      //   },
      // })

      return newUser;
    }
  }

  return currentUser
}

const getCurrentUserHandler: ApiHandler = async (_event: HandlerEvent, context: AuthContext<ApplicationUser>) => {
  const auth0Id = context.user?.auth0Id;
  if (!auth0Id) {
    return error('Unauthorized: user not found', 401)
  }
  const applicationUser = {
    ...await getCurrentUser(auth0Id),
    email_verified: context.user?.email_verified,
    avatar: context.user?.picture,
  };
  // TODO: remove avatar from the database
  return success({ data: applicationUser })
}

export const handler = withAuth(getCurrentUserHandler, {
  emailVerificationRequired: false,
})
