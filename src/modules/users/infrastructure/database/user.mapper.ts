import { User } from '../../domain/entities/user.entity'
import { UserEntity } from './user.entity'

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    return new User(
      raw.id,
      raw.name,
      raw.email,
      raw.password,
      raw.createdAt,
      raw.updatedAt,
    )
  }

  static toEntity(user: User): Partial<UserEntity> {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
