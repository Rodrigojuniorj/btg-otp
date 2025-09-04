export interface GetOtpStatusRequest {
  hash: string
}

export interface GetOtpStatusResponse {
  status: string
  expiresAt: Date
}
