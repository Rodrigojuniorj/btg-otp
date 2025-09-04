import { UserMapper } from '../infrastructure/database/user.mapper'
import { User } from '../domain/entities/user.entity'
import { UserEntity } from '../infrastructure/database/user.entity'

describe('UserMapper', () => {
  describe('toDomain', () => {
    it('should convert UserEntity to User domain entity', () => {
      const userEntity = new UserEntity()
      userEntity.id = 1
      userEntity.name = 'Test User'
      userEntity.email = 'test@example.com'
      userEntity.password = 'hashedPassword'
      userEntity.createdAt = new Date('2023-01-01T00:00:00Z')
      userEntity.updatedAt = new Date('2023-01-01T00:00:00Z')

      const result = UserMapper.toDomain(userEntity)

      expect(result).toBeInstanceOf(User)
      expect(result.id).toBe(userEntity.id)
      expect(result.name).toBe(userEntity.name)
      expect(result.email).toBe(userEntity.email)
      expect(result.password).toBe(userEntity.password)
      expect(result.createdAt).toBe(userEntity.createdAt)
      expect(result.updatedAt).toBe(userEntity.updatedAt)
    })
  })

  describe('toEntity', () => {
    it('should convert User domain entity to UserEntity', () => {
      const user = new User(
        1,
        'Test User',
        'test@example.com',
        'hashedPassword',
        new Date('2023-01-01T00:00:00Z'),
        new Date('2023-01-01T00:00:00Z'),
      )

      const result = UserMapper.toEntity(user)

      expect(result).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
    })
  })
})
