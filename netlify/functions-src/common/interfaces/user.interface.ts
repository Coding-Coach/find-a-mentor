export interface User {
  _id?: string
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
