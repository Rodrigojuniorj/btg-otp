export interface CreateUserRequest {
  name: string
  email: string
  password: string
}

export interface CreateUserResponse {
  id: number
  name: string
  email: string
  createdAt: Date
}
