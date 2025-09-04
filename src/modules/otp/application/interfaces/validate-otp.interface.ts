export interface ValidateOtpRequest {
  otpCode: string
  hash: string
}

export interface ValidateOtpResponse {
  message: string
}
