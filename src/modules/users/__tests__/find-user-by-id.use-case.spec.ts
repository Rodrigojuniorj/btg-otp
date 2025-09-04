import { Test, TestingModule } from '@nestjs/testing'
import { FindUserByIdUseCase } from '../application/use-cases/find-user-by-id.use-case'
import { UserRepositoryPort } from '../domain/repositories/user.repository.port'
import { User } from '../domain/entities/user.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

describe('FindUserByIdUseCase', () => {
  let useCase: FindUserByIdUseCase
  let userRepository: jest.Mocked<UserRepositoryPort>

  const mockUserRepository = {
    findById: jest.fn(),
    create: jest.fn(),
    findByEmail: jest.fn(),
    findByEmailAndPassword: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByIdUseCase,
        {
          provide: UserRepositoryPort,
          useValue: mockUserRepository,
        },
      ],
    }).compile()

    useCase = module.get<FindUserByIdUseCase>(FindUserByIdUseCase)
    userRepository = module.get(UserRepositoryPort)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return user profile successfully', async () => {
      const userId = 1
      const mockUser = new User(
        1,
        'Test User',
        'test@example.com',
        'hashedPassword',
        new Date(),
        new Date(),
      )

      userRepository.findById.mockResolvedValue(mockUser)

      const result = await useCase.execute({ id: userId })

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      })
      expect(userRepository.findById).toHaveBeenCalledWith(userId)
    })

    it('should throw error when user is not found', async () => {
      const userId = 999

      userRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute({ id: userId })).rejects.toThrow(
        new CustomException(ErrorMessages.USER.NOT_FOUND(userId)),
      )
      expect(userRepository.findById).toHaveBeenCalledWith(userId)
    })
  })
})
