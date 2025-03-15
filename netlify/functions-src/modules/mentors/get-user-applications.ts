import { HandlerEvent } from '@netlify/functions'
import { withErrorHandling } from '../../utils/response'
import { success, error } from '../../utils/response'
import { connectToDatabase, getCollection } from '../../utils/db'
import { ApiHandler, AuthContext } from '../../types'
import { withAuth } from '../../utils/auth'
import { ObjectId } from 'mongodb'

enum Status {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

enum Role {
  ADMIN = 'admin',
  MENTOR = 'mentor'
}

interface User {
  _id: ObjectId
  auth0Id: string
  roles: Role[]
}

interface Application {
  _id: string
  user: ObjectId
  status: Status
  description?: string
  reason?: string
  createdAt: Date
  updatedAt: Date
}

const getUserApplications = async (userId: string, status?: string): Promise<Application[]> => {
  await connectToDatabase()
  const collection = getCollection<Application>('applications')

  const filter: any = {
    user: new ObjectId(userId)
  }

  if (status && Status[status.toUpperCase()]) {
    filter.status = Status[status.toUpperCase()]
  }

  return collection.find(filter).toArray()
}

const getUserApplicationsHandler: ApiHandler = async (event: HandlerEvent, context: AuthContext) => {
  if (!context.user) {
    return error('Unauthorized', 401)
  }

  const userId = event.path.split('/').pop()
  const status = event.queryStringParameters?.status

  if (!userId) {
    return error('User ID is required', 400)
  }

  // Get current user and requested user
  const usersCollection = getCollection<User>('users')
  const [currentUser, requestedUser] = await Promise.all([
    usersCollection.findOne({ auth0Id: context.user.id }),
    usersCollection.findOne({ _id: new ObjectId(userId) })
  ])

  if (!requestedUser) {
    return error('User not found', 404)
  }

  // Only allow current user or admin to view applications
  if (!currentUser?._id.equals(requestedUser._id) && !currentUser?.roles.includes(Role.ADMIN)) {
    return error('Not authorized to perform this operation', 401)
  }

  const applications = await getUserApplications(userId, status)
  return success({ data: applications })
}

export const handler = withAuth(withErrorHandling(getUserApplicationsHandler))