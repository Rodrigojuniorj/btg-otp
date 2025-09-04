import { Injectable } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import {
  FindUserByEmailAndPasswordRequest,
  FindUserByEmailAndPasswordResponse,
} from '../interfaces/find-user-email-and-password.interface'

@Injectable()
export class FindUserByEmailAndPasswordUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(
    request: FindUserByEmailAndPasswordRequest,
  ): Promise<FindUserByEmailAndPasswordResponse | null> {
    const { email } = request

    const user = await this.userRepository.findByEmailAndPassword(email)

    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
