import { Injectable } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import {
  FindUserByEmailRequest,
  FindUserByEmailResponse,
} from '../interfaces/find-user.interface'

@Injectable()
export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(
    request: FindUserByEmailRequest,
  ): Promise<FindUserByEmailResponse | null> {
    const { email } = request

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
