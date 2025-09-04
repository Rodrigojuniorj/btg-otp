import { Test, TestingModule } from '@nestjs/testing'
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case'
import { UserRepositoryPort } from '../domain/repositories/user.repository.port'
import { User } from '../domain/entities/user.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase
  let userRepository: jest.Mocked<UserRepositoryPort>

  const mockUserRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByEmailAndPassword: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: UserRepositoryPort,
          useValue: mockUserRepository,
        },
      ],
    }).compile()

    useCase = module.get<DeleteUserUseCase>(DeleteUserUseCase)
    userRepository = module.get(UserRepositoryPort)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should delete user successfully', async () => {
      const request = {
        id: 1,
      }

      const mockUser = new User(
        1,
        'Test User',
        'test@example.com',
        'hashedPassword',
        new Date(),
        new Date(),
      )

      userRepository.findById.mockResolvedValue(mockUser)
      userRepository.delete.mockResolvedValue(undefined)

      const result = await useCase.execute(request)

      expect(result).toEqual({
        message: 'Usuário deletado com sucesso',
      })

      expect(userRepository.findById).toHaveBeenCalledWith(request.id)
      expect(userRepository.delete).toHaveBeenCalledWith(request.id)
    })

    it('should throw error when user is not found', async () => {
      const request = {
        id: 999,
      }

      userRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute(request)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.NOT_FOUND(request.id)),
      )

      expect(userRepository.findById).toHaveBeenCalledWith(request.id)
      expect(userRepository.delete).not.toHaveBeenCalled()
    })
  })
})
