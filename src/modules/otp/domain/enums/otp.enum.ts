export enum OtpPurpose {
  GENERAL = 'general',
  VERIFICATION = 'verification',
  LOGIN = 'login',
  PASSWORD_RESET = 'password_reset',
}

export enum OtpStatus {
  PENDING = 'pending',
  VALIDATED = 'validated',
  EXPIRED = 'expired',
  FAILED = 'failed',
}
