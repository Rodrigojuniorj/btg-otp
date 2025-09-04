import { JwtTypeSign } from '../enums/jwt-type-sign.enum'

export interface JwtOtpPayload {
  sub: number
  email: string
  hash: string
  type: JwtTypeSign
}
