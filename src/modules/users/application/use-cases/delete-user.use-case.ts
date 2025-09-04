import { Injectable, HttpStatus } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import {
  DeleteUserRequest,
  DeleteUserResponse,
} from '../interfaces/delete-user.interface'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(request: DeleteUserRequest): Promise<DeleteUserResponse> {
    const { id } = request

    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new CustomException(
        ErrorMessages.USER.NOT_FOUND(id),
        HttpStatus.NOT_FOUND,
      )
    }

    await this.userRepository.delete(id)

    return {
      message: 'Usuário deletado com sucesso',
    }
  }
}
