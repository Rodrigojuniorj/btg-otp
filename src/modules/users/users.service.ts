import { Injectable } from '@nestjs/common'
import { UserRepositoryPort } from './repositories/port/user.repository.port'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { CustomException } from '@/common/exceptions/customException'
import { UserResponsePasswordDto } from './dto/user-response-password.dto'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    return await this.userRepository.findByEmail(email)
  }

  async findByEmailAndPassword(
    email: string,
  ): Promise<UserResponsePasswordDto | null> {
    return await this.userRepository.findByEmailAndPassword(email)
  }

  async profile(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }

    return { ...user, password: undefined } as Omit<typeof user, 'password'>
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }

    return user
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    return await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    await this.findById(id)

    await this.userRepository.update(id, updateUserDto)
  }

  async delete(id: number): Promise<void> {
    await this.findById(id)

    return this.userRepository.delete(id)
  }

  async findAll(): Promise<UserResponseDto[]> {
    return await this.userRepository.findAll()
  }
}
