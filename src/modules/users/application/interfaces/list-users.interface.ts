export interface ListUsersRequest {
  page?: number
  limit?: number
}

export interface ListUsersResponse {
  users: Array<{
    id: number
    name: string
    email: string
    createdAt: Date
    updatedAt: Date
  }>
  total: number
  page: number
  limit: number
}
