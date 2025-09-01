import { SetMetadata } from '@nestjs/common'

export const OTP_AUTH_KEY = 'otp-auth'
export const OtpAuth = () => SetMetadata(OTP_AUTH_KEY, true)
