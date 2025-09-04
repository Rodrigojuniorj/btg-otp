import { Injectable } from '@nestjs/common'
import { FindUserByEmailAndPasswordUseCase } from '../../../users/application/use-cases/find-user-by-email-and-password.use-case'
import { CreateUserUseCase } from '../../../users/application/use-cases/create-user.use-case'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import {
  RegisterRequest,
  RegisterResponse,
} from '../interfaces/register.interface'

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly findUserByEmailAndPasswordUseCase: FindUserByEmailAndPasswordUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async execute(request: RegisterRequest): Promise<RegisterResponse> {
    const { name, email, password } = request

    const existingUser = await this.findUserByEmailAndPasswordUseCase.execute({
      email,
      password: '',
    })

    if (existingUser) {
      throw new CustomException(ErrorMessages.USER.EMAIL_EXISTS())
    }

    await this.createUserUseCase.execute({
      name,
      email,
      password,
    })

    return {
      message: 'Usuário criado com sucesso',
    }
  }
}
