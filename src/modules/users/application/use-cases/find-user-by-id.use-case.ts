import { Injectable, HttpStatus } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import {
  FindUserByIdRequest,
  FindUserByIdResponse,
} from '../interfaces/find-user.interface'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(request: FindUserByIdRequest): Promise<FindUserByIdResponse> {
    const { id } = request

    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new CustomException(
        ErrorMessages.USER.NOT_FOUND(id),
        HttpStatus.NOT_FOUND,
      )
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
