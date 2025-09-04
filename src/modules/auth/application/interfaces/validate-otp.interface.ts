export interface ValidateOtpRequest {
  otpCode: string
  user: {
    sub: number
    email: string
    hash: string
  }
}

export interface ValidateOtpResponse {
  accessToken: string
}
