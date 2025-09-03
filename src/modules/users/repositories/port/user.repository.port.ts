import { UpdateUserDto } from '../../dto/update-user.dto'
import { CreateUserDto } from '../../dto/create-user.dto'
import { UserResponseDto } from '../../dto/user-response.dto'
import { UserResponsePasswordDto } from '../../dto/user-response-password.dto'
import { UserDto } from '../../dto/user.dto'

export abstract class UserRepositoryPort {
  abstract findByEmail(email: string): Promise<UserDto | null>

  abstract findByEmailAndPassword(
    email: string,
  ): Promise<UserResponsePasswordDto | null>

  abstract findById(id: number): Promise<UserDto | null>

  abstract create(createUserDto: CreateUserDto): Promise<void>

  abstract update(id: number, updateUserDto: UpdateUserDto): Promise<void>

  abstract delete(id: number): Promise<void>

  abstract findAll(): Promise<UserResponseDto[]>
}
