import { Injectable, HttpStatus } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { User } from '../../domain/entities/user.entity'
import {
  CreateUserRequest,
  CreateUserResponse,
} from '../interfaces/create-user.interface'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const { name, email, password } = request

    if (!name || !email) {
      throw new CustomException(
        ErrorMessages.USER.INVALID_DATA(),
        HttpStatus.BAD_REQUEST,
      )
    }

    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser) {
      throw new CustomException(
        ErrorMessages.USER.EMAIL_EXISTS(),
        HttpStatus.CONFLICT,
      )
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : ''
    const user = User.create(name, email, hashedPassword)

    const createdUser = await this.userRepository.create(user)

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
    }
  }
}
