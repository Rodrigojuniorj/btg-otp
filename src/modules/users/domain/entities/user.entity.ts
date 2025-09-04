export class User {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(name: string, email: string, password: string): User {
    const now = new Date()
    return new User(0, name, email, password, now, now)
  }

  updateName(name: string): User {
    return new User(
      this.id,
      name,
      this.email,
      this.password,
      this.createdAt,
      new Date(),
    )
  }

  updateEmail(email: string): User {
    return new User(
      this.id,
      this.name,
      email,
      this.password,
      this.createdAt,
      new Date(),
    )
  }

  updatePassword(password: string): User {
    return new User(
      this.id,
      this.name,
      this.email,
      password,
      this.createdAt,
      new Date(),
    )
  }
}
