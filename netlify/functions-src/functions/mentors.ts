import { HandlerEvent } from '@netlify/functions'
import { withErrorHandling } from './utils/response'
import { success } from './utils/response'
import { connectToDatabase, getCollection } from './utils/db'
import { ApiHandler, type PaginationParams } from './types'

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
}

enum Role {
  ADMIN = 'Admin',
  MENTOR = 'Mentor'
}

interface GetMentorsQuery {
  tags?: string | string[]
  country?: string
  spokenLanguages?: string | string[]
  page?: string
  limit?: string
}

interface GetMentorsResponse {
  data: Mentor[]
  filters: any[]
  pagination: PaginationParams;
}

const getMentors = async (query: GetMentorsQuery): Promise<GetMentorsResponse> => {
  const { tags, country, spokenLanguages, page: pageInQuery = '1', page: limitinQuery = '20' } = query
  const page = parseInt(pageInQuery)
  const limit = parseInt(limitinQuery)

  await connectToDatabase()
  const collection = getCollection<Mentor>('users')

  const filter: any = {
    roles: Role.MENTOR,
  };

  if (tags) {
    filter.tags = Array.isArray(tags) ? { $in: tags } : { $in: [tags] }
  }

  if (country) {
    filter.country = country
  }

  if (spokenLanguages) {
    filter.spokenLanguages = Array.isArray(spokenLanguages)
      ? { $in: spokenLanguages }
      : { $in: [spokenLanguages] }
  }
  const skip = (page - 1) * limit
  const mentors = await collection
    .find(filter)
    .skip(skip)
    .limit(limit)
    .map(function (mentor) {
      return {
        ...mentor,
        // TODO: return channels when is current user's mentor
        channels: [],
      }
    })
    .toArray()

  return {
    data: mentors,
    filters: [],
    pagination: {
      hasMore: mentors.length === limit,
      page,
      total: 0,
    }
  }
}

const getMentorsHandler: ApiHandler = async (event: HandlerEvent) => {
  const query = event.queryStringParameters || {}
  const result = await getMentors(query)
  return success(result)
}

export const handler = withErrorHandling(getMentorsHandler)