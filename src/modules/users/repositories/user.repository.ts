import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { UserRepositoryPort } from './port/user.repository.port'
import { UpdateUserDto } from '../dto/update-user.dto'
import { CreateUserDto } from '../dto/create-user.dto'
import { UserResponseDto } from '../dto/user-response.dto'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { UserResponsePasswordDto } from '../dto/user-response-password.dto'
import { UserDto } from '../dto/user.dto'

@Injectable()
export class UserRepository extends UserRepositoryPort {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {
    super()
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    return await this.repository.findOne({ where: { email } })
  }

  async findByEmailAndPassword(
    email: string,
  ): Promise<UserResponsePasswordDto | null> {
    return await this.repository.findOne({ where: { email } })
  }

  async findById(id: number): Promise<UserDto | null> {
    return await this.repository.findOne({ where: { id } })
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    const user = this.repository.create(createUserDto)
    await this.repository.save(user)
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    await this.repository.update(id, updateUserDto)
  }

  async delete(id: number): Promise<void> {
    const user = await this.repository.findOne({ where: { id } })

    if (!user) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }

    await this.repository.remove(user)
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.repository.find()
    return users.map((user) => {
      const dto = new UserResponseDto()
      dto.id = user.id
      dto.name = user.name
      dto.email = user.email
      dto.createdAt = user.createdAt
      dto.updatedAt = user.updatedAt
      return dto
    })
  }
}
