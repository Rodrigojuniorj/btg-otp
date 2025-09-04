export class AuthUser {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
  ) {}

  static fromUserData(id: number, name: string, email: string): AuthUser {
    return new AuthUser(id, name, email)
  }
}
