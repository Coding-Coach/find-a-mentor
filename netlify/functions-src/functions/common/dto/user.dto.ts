import type { ObjectId } from 'mongodb'
import { Role } from '../interfaces/user.interface'

export class UserDto {
  _id: ObjectId
  auth0Id: string
  email: string
  name: string
  avatar?: string
  roles: Role[]

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial)
  }
}
