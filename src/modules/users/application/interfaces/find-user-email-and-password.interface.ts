export interface FindUserByEmailAndPasswordRequest {
  email: string
  password: string
}

export interface FindUserByEmailAndPasswordResponse {
  id: number
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}
