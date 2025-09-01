import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { RegisterDto } from './dtos/register.dto'
import { UserRepositoryPort } from '../users/repositories/port/user.repository.port'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepositoryPort) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(
      registerDto.email,
    )

    if (existingUser) {
      throw new CustomException(ErrorMessages.USER.EMAIL_EXISTS())
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10)

    await this.userRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    })
  }
}
