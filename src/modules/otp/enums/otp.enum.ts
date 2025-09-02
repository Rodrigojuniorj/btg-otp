export enum OtpStatus {
  PENDING = 'pending',
  VALIDATED = 'validated',
  EXPIRED = 'expired',
  FAILED = 'failed',
}

export enum OtpPurpose {
  LOGIN = 'login',
  VERIFICATION = 'verification',
  RESET = 'reset',
  REGISTRATION = 'registration',
  GENERAL = 'general',
}
