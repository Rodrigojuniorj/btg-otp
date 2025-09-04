import { Injectable, HttpStatus } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import {
  UpdateUserRequest,
  UpdateUserResponse,
} from '../interfaces/update-user.interface'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    const { id, name, email, password } = request

    const existingUser = await this.userRepository.findById(id)

    if (!existingUser) {
      throw new CustomException(
        ErrorMessages.USER.NOT_FOUND(id),
        HttpStatus.NOT_FOUND,
      )
    }

    let updatedUser = existingUser

    if (name) {
      updatedUser = updatedUser.updateName(name)
    }

    if (email) {
      const emailExists = await this.userRepository.findByEmail(email)
      if (emailExists && emailExists.id !== id) {
        throw new CustomException(
          ErrorMessages.USER.EMAIL_EXISTS(),
          HttpStatus.CONFLICT,
        )
      }
      updatedUser = updatedUser.updateEmail(email)
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updatedUser = updatedUser.updatePassword(hashedPassword)
    }

    const result = await this.userRepository.update(updatedUser)

    return {
      id: result.id,
      name: result.name,
      email: result.email,
      updatedAt: result.updatedAt,
    }
  }
}
