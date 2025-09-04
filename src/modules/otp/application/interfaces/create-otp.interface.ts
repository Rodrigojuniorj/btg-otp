import { OtpPurpose } from '../../domain/enums/otp.enum'

export interface CreateOtpRequest {
  email: string
  purpose?: OtpPurpose
}

export interface CreateOtpResponse {
  hash: string
  expiresAt: Date
  otpCode: string
  identifier: string
  purpose: OtpPurpose
}
