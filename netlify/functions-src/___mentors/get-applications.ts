import { HandlerEvent } from '@netlify/functions'
import { withErrorHandling } from '../utils/response'
import { success } from '../utils/response'
import { connectToDatabase, getCollection } from '../utils/db'
import { ApiHandler, AuthContext } from '../types'
import { withAuth } from '../utils/auth'

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
  _id: string
  auth0Id: string
  roles: Role[]
}

interface Application {
  _id: string
  user: string
  status: Status
  description?: string
  reason?: string
  createdAt: Date
  updatedAt: Date
}

const getApplications = async (status?: string): Promise<Application[]> => {
  await connectToDatabase()
  const collection = getCollection<Application>('applications')

  const filter: any = {}
  const nextStatus = status?.toUpperCase() as keyof typeof Status;
  if (status && nextStatus) {
    filter.status = nextStatus;
  }

  return collection.find(filter).toArray()
}

const getApplicationsHandler: ApiHandler = async (event: HandlerEvent, context: AuthContext) => {
  const { user } = context
  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' })
    }
  }

  const status = event.queryStringParameters?.status

  // Check if user is admin
  const usersCollection = getCollection<User>('users')
  const currentUser = await usersCollection.findOne({ auth0Id: user.id })

  if (!currentUser?.roles.includes(Role.ADMIN)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' })
    }
  }

  const applications = await getApplications(status)
  return success({ data: applications })
}

export const handler = withAuth(withErrorHandling(getApplicationsHandler))