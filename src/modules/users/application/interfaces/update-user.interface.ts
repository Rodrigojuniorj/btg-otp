export interface UpdateUserRequest {
  id: number
  name?: string
  email?: string
  password?: string
}

export interface UpdateUserResponse {
  id: number
  name: string
  email: string
  updatedAt: Date
}
