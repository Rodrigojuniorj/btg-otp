export interface JwtOtpPayload {
  sub: number
  email: string
  hash: string
  type: string
}
