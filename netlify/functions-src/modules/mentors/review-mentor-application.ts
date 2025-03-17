import { HandlerEvent } from '@netlify/functions'
import { withErrorHandling } from '../../utils/response'
import { success, error } from '../../utils/response'
import { connectToDatabase, getCollection } from '../../utils/db'
import { ApiHandler } from '../../types'
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
  available: boolean
}

interface Application {
  _id: ObjectId
  user: string | ObjectId
  status: Status
  description?: string
  reason?: string
  createdAt: Date
  updatedAt: Date
}

interface ReviewApplicationDto {
  status: Status
  reason?: string
}

const findApplicationById = async (applicationId: string): Promise<Application | null> => {
  await connectToDatabase()
  const collection = getCollection<Application>('applications')

  return collection.findOne({ _id: new ObjectId(applicationId) })
}

const updateApplication = async (applicationId: string, update: Partial<Application>): Promise<void> => {
  await connectToDatabase()
  const collection = getCollection<Application>('applications')

  await collection.updateOne(
    { _id: new ObjectId(applicationId) },
    {
      $set: {
        ...update,
        updatedAt: new Date()
      }
    }
  )
}

const updateUser = async (userId: string, update: Partial<User>): Promise<void> => {
  await connectToDatabase()
  const collection = getCollection<User>('users')

  await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: update }
  )
}

const reviewMentorApplicationHandler: ApiHandler = async (event: HandlerEvent, context) => {
  if (!context.user) {
    return error('Unauthorized', 401)
  }

  const applicationId = event.path.split('/').pop()
  if (!applicationId) {
    return error('Application ID is required', 400)
  }

  const data = JSON.parse(event.body || '{}') as ReviewApplicationDto

  if (!data.status) {
    return error('Status is required', 400)
  }

  // Get current user and check if admin
  const usersCollection = getCollection<User>('users')
  const currentUser = await usersCollection.findOne({ auth0Id: context.user.id })

  if (!currentUser?.roles.includes(Role.ADMIN)) {
    return error('Access denied', 401)
  }

  // Get application
  const application = await findApplicationById(applicationId)
  if (!application) {
    return error('Application not found', 404)
  }

  if (application.status === Status.APPROVED) {
    return error('This Application is already approved', 400)
  }

  // Update application
  await updateApplication(applicationId, {
    status: data.status,
    reason: data.reason
  })

  // If approved, update user roles
  if (data.status === Status.APPROVED) {
    const userId = application.user.toString()
    await updateUser(userId, {
      roles: [Role.MENTOR],
      available: true
    })
  }

  // TODO: Send email notification
  // This will be implemented in a separate function

  return success({ success: true })
}

export const handler = withAuth(withErrorHandling(reviewMentorApplicationHandler))