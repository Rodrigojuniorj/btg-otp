export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  taskType: string
  accessToken: string
  validationUrl: string
}
