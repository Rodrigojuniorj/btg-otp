export enum AuthTaskType {
  OTP_CHALLENGER = 'OTP_CHALLENGER',
}

export enum AuthStatus {
  PENDING_OTP = 'PENDING_OTP',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}
