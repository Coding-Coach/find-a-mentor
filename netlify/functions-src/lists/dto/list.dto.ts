export class ListDto {
  name: string
  isFavorite: boolean
  user: string
  mentors: string[]

  constructor(partial: Partial<ListDto>) {
    Object.assign(this, partial)
  }
}
