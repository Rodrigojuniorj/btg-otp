import { Injectable } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import {
  ListUsersRequest,
  ListUsersResponse,
} from '../interfaces/list-users.interface'

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(request: ListUsersRequest): Promise<ListUsersResponse> {
    const { page = 1, limit = 10 } = request

    const users = await this.userRepository.findAll()

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = users.slice(startIndex, endIndex)

    return {
      users: paginatedUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      total: users.length,
      page,
      limit,
    }
  }
}
