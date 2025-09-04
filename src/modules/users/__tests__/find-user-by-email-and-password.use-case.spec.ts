import { Test, TestingModule } from '@nestjs/testing'
import { FindUserByEmailAndPasswordUseCase } from '../application/use-cases/find-user-by-email-and-password.use-case'
import { UserRepositoryPort } from '../domain/repositories/user.repository.port'
import { User } from '../domain/entities/user.entity'

describe('FindUserByEmailAndPasswordUseCase', () => {
  let useCase: FindUserByEmailAndPasswordUseCase
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
        FindUserByEmailAndPasswordUseCase,
        {
          provide: UserRepositoryPort,
          useValue: mockUserRepository,
        },
      ],
    }).compile()

    useCase = module.get<FindUserByEmailAndPasswordUseCase>(
      FindUserByEmailAndPasswordUseCase,
    )
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
        password: 'password123',
      }

      const mockUser = new User(
        1,
        'Test User',
        'test@example.com',
        'hashedPassword',
        new Date(),
        new Date(),
      )

      userRepository.findByEmailAndPassword.mockResolvedValue(mockUser)

      const result = await useCase.execute(request)

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      })
      expect(userRepository.findByEmailAndPassword).toHaveBeenCalledWith(
        request.email,
      )
    })

    it('should return null when user is not found', async () => {
      const request = {
        email: 'nonexistent@example.com',
        password: 'password123',
      }

      userRepository.findByEmailAndPassword.mockResolvedValue(null)

      const result = await useCase.execute(request)

      expect(result).toBeNull()
      expect(userRepository.findByEmailAndPassword).toHaveBeenCalledWith(
        request.email,
      )
    })
  })
})
