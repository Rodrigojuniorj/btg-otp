import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './infrastructure/database/user.entity'
import { UserRepository } from './infrastructure/database/user.repository'
import { UserRepositoryPort } from './domain/repositories/user.repository.port'
import { UsersController } from './infrastructure/web/users.controller'
import { CreateUserUseCase } from './application/use-cases/create-user.use-case'
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.use-case'
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email.use-case'
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case'
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case'
import { ListUsersUseCase } from './application/use-cases/list-users.use-case'
import { FindUserByEmailAndPasswordUseCase } from './application/use-cases/find-user-by-email-and-password.use-case'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
    FindUserByEmailAndPasswordUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ListUsersUseCase,
    UserRepository,
    {
      provide: UserRepositoryPort,
      useClass: UserRepository,
    },
  ],
  exports: [
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
    FindUserByEmailAndPasswordUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ListUsersUseCase,
  ],
})
export class UsersModule {}
