import type { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  auth0Id: string
  email: string
  name: string
  avatar?: string
  roles: Role[]
  country?: string
  image?: {
    filename: string
  }
  channels?: any[]
}

export enum Role {
  ADMIN = 'admin',
  MEMBER = 'member',
  MENTOR = 'mentor'
}
