export class AuthSession {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly hash: string,
    public readonly otpToken: string,
    public readonly accessToken?: string,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(
    userId: number,
    email: string,
    hash: string,
    otpToken: string,
  ): AuthSession {
    return new AuthSession(userId, email, hash, otpToken)
  }

  completeLogin(accessToken: string): AuthSession {
    return new AuthSession(
      this.userId,
      this.email,
      this.hash,
      this.otpToken,
      accessToken,
      this.createdAt,
    )
  }
}
