import { Test, TestingModule } from '@nestjs/testing'
import { FindUserByEmailUseCase } from '../application/use-cases/find-user-by-email.use-case'
import { UserRepositoryPort } from '../domain/repositories/user.repository.port'
import { User } from '../domain/entities/user.entity'

describe('FindUserByEmailUseCase', () => {
  let useCase: FindUserByEmailUseCase
  let userRepository: jest.Mocked<UserRepositoryPort>

  const mockUserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findByEmailAndPassword: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByEmailUseCase,
        {
          provide: UserRepositoryPort,
          useValue: mockUserRepository,
        },
      ],
    }).compile()

    useCase = module.get<FindUserByEmailUseCase>(FindUserByEmailUseCase)
    userRepository = module.get(UserRepositoryPort)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return user when found', async () => {
      const request = {
        email: 'test@example.com',
      }

      const mockUser = new User(
        1,
        'Test User',
        'test@example.com',
        'hashedPassword',
        new Date(),
        new Date(),
      )

      userRepository.findByEmail.mockResolvedValue(mockUser)

      const result = await useCase.execute(request)

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      })
      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email)
    })

    it('should return null when user is not found', async () => {
      const request = {
        email: 'nonexistent@example.com',
      }

      userRepository.findByEmail.mockResolvedValue(null)

      const result = await useCase.execute(request)

      expect(result).toBeNull()
      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email)
    })
  })
})
