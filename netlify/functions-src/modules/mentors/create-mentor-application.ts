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

interface User {
  _id: string
  auth0Id: string
  email: string
  name: string
}

interface Application {
  _id?: string
  user: string | ObjectId
  status: Status
  description?: string
  reason?: string
  createdAt: Date
  updatedAt: Date
}

interface CreateApplicationDto {
  description: string
}

const findActiveApplicationByUser = async (userId: string): Promise<Application | null> => {
  await connectToDatabase()
  const collection = getCollection<Application>('applications')

  return collection.findOne({
    user: new ObjectId(userId),
    status: { $in: [Status.PENDING, Status.APPROVED] }
  })
}

const createApplication = async (application: Application): Promise<Application> => {
  await connectToDatabase()
  const collection = getCollection<Application>('applications')

  const now = new Date()
  const newApplication = {
    ...application,
    createdAt: now,
    updatedAt: now
  }

  const result = await collection.insertOne(newApplication)
  return { ...newApplication, _id: result.insertedId }
}

const createMentorApplicationHandler: ApiHandler = async (event: HandlerEvent, context) => {
  if (!context.user) {
    return error('Unauthorized', 401)
  }

  const data = JSON.parse(event.body || '{}') as CreateApplicationDto

  if (!data.description) {
    return error('Description is required', 400)
  }

  // Get user from database
  const usersCollection = getCollection<User>('users')
  const user = await usersCollection.findOne({ auth0Id: context.user.id })

  if (!user) {
    return error('User not found', 404)
  }

  // Check if user already has an active application
  const existingApplication = await findActiveApplicationByUser(user._id.toString())

  if (existingApplication) {
    if (existingApplication.status === Status.PENDING) {
      return error('You already applied, your application is in review.', 400)
    } else if (existingApplication.status === Status.APPROVED) {
      return error('You already applied, your application has been approved', 400)
    }
  }

  // Create new application
  const application: Application = {
    user: user._id,
    status: Status.PENDING,
    description: data.description,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  await createApplication(application)

  // TODO: Send email notification
  // This will be implemented in a separate function

  return success({ success: true })
}

export const handler = withAuth(withErrorHandling(createMentorApplicationHandler))