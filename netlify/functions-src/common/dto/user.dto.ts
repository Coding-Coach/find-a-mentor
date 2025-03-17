import { Role } from '../interfaces/user.interface'

export class UserDto {
  _id?: string
  auth0Id: string
  email: string
  name: string
  avatar?: string
  roles: Role[]

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial)
  }
}
