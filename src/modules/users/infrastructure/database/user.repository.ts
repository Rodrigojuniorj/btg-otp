import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from './user.entity'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { User } from '../../domain/entities/user.entity'
import { UserMapper } from './user.mapper'

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(user: User): Promise<User> {
    const persistenceUser = UserMapper.toEntity(user)
    const newUser = this.repository.create(persistenceUser)
    const savedUser = await this.repository.save(newUser)
    return UserMapper.toDomain(savedUser)
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({
      where: { email },
    })
    return userEntity ? UserMapper.toDomain(userEntity) : null
  }

  async findByEmailAndPassword(email: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({
      where: { email },
    })

    return userEntity ? UserMapper.toDomain(userEntity) : null
  }

  async findById(id: number): Promise<User | null> {
    const userEntity = await this.repository.findOne({
      where: { id },
    })
    return userEntity ? UserMapper.toDomain(userEntity) : null
  }

  async update(user: User): Promise<User> {
    const persistenceUser = UserMapper.toEntity(user)
    await this.repository.update(user.id, persistenceUser)
    return user
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id)
  }

  async findAll(): Promise<User[]> {
    const userEntities = await this.repository.find()
    return userEntities.map(UserMapper.toDomain)
  }
}
