import { HandlerEvent } from '@netlify/functions'
import { withErrorHandling } from '../../utils/response'
import { success } from '../../utils/response'
import { connectToDatabase, getCollection } from '../../utils/db'
import { ApiHandler } from '../../types'

interface Mentor {
  _id: string
  name: string
  email: string
  title?: string
  company?: string
  tags?: string[]
  country?: string
  spokenLanguages?: string[]
  avatar?: string
  available: boolean
  roles: string[]
}

const getFeaturedMentor = async (): Promise<Mentor> => {
  await connectToDatabase()
  const collection = getCollection<Mentor>('users')

  // Find a random available mentor
  const mentors = await collection
    .aggregate<Mentor>([
      { $match: { roles: 'mentor', available: true } },
      { $sample: { size: 1 } }
    ])
    .toArray()

  if (!mentors.length) {
    throw new Error('No mentors found')
  }

  return mentors[0]
}

const getFeaturedMentorHandler: ApiHandler = async (event: HandlerEvent) => {
  const mentor = await getFeaturedMentor()
  return success({ data: mentor })
}

export const handler = withErrorHandling(getFeaturedMentorHandler)