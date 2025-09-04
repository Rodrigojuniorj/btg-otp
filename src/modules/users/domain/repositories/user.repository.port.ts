import { User } from '../entities/user.entity'

export abstract class UserRepositoryPort {
  abstract create(user: User): Promise<User>

  abstract findByEmail(email: string): Promise<User | null>

  abstract findByEmailAndPassword(email: string): Promise<User | null>

  abstract findById(id: number): Promise<User | null>

  abstract update(user: User): Promise<User>

  abstract delete(id: number): Promise<void>

  abstract findAll(): Promise<User[]>
}
