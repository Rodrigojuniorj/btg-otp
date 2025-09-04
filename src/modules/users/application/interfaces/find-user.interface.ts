export interface FindUserByIdRequest {
  id: number
}

export interface FindUserByIdResponse {
  id: number
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface FindUserByEmailRequest {
  email: string
}

export interface FindUserByEmailResponse {
  id: number
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}
