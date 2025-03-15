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
}

interface GetMentorsQuery {
  tags?: string | string[]
  country?: string
  spokenLanguages?: string | string[]
  page?: string
  limit?: string
}

interface GetMentorsResponse {
  mentors: Mentor[]
  page: number
  limit: number
}

const getMentors = async (query: GetMentorsQuery): Promise<GetMentorsResponse> => {
  const { tags, country, spokenLanguages, page = '1', limit = '20' } = query

  await connectToDatabase()
  const collection = getCollection<Mentor>('mentors')

  const filter: any = {}

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

  const skip = (parseInt(page) - 1) * parseInt(limit)
  const mentors = await collection
    .find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .toArray()

  return {
    mentors,
    page: parseInt(page),
    limit: parseInt(limit)
  }
}

const getMentorsHandler: ApiHandler = async (event: HandlerEvent) => {
  const query = event.queryStringParameters || {}
  const result = await getMentors(query)
  return success(result)
}

export const handler = withErrorHandling(getMentorsHandler)