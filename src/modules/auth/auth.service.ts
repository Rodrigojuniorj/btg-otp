import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { RegisterDto } from './dtos/register.dto'
import { AuthUser } from './interfaces/auth-response.interface'
import { UserRepositoryPort } from '../users/repositories/port/user.repository.port'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { LoginDto } from './dtos/login.dto'
import { AuthLoginResponseDto } from './dtos/auth-login-response.dto'
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepositoryPort,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthUser> {
    const user = await this.userRepository.findByEmailAndPassword(email)

    if (!user) {
      throw new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS())
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    }

    throw new CustomException(ErrorMessages.USER.INVALID_CREDENTIALS())
  }

  async login(data: LoginDto): Promise<AuthLoginResponseDto> {
    const user = await this.validateUser(data.email, data.password)

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }

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
