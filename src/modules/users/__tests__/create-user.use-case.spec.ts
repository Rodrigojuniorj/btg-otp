import { Test, TestingModule } from '@nestjs/testing'
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case'
import { UserRepositoryPort } from '../domain/repositories/user.repository.port'
import { User } from '../domain/entities/user.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import * as bcrypt from 'bcryptjs'
import { CreateUserRequest } from '../application/interfaces/create-user.interface'

jest.mock('bcryptjs')
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase
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
        CreateUserUseCase,
        {
          provide: UserRepositoryPort,
          useValue: mockUserRepository,
        },
      ],
    }).compile()

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase)
    userRepository = module.get(UserRepositoryPort)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should create user successfully', async () => {
      const request = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }

      const hashedPassword = 'hashedPassword123'
      const mockUser = new User(
        1,
        request.name,
        request.email,
        hashedPassword,
        new Date(),
        new Date(),
      )

      mockBcrypt.hash.mockResolvedValue(hashedPassword as never)
      userRepository.findByEmail.mockResolvedValue(null)
      userRepository.create.mockResolvedValue(mockUser)

      const result = await useCase.execute(request)

      expect(mockBcrypt.hash).toHaveBeenCalledWith(request.password, 10)
      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email)
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: request.name,
          email: request.email,
          password: hashedPassword,
        }),
      )
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
      })
    })

    it('should throw error when email already exists', async () => {
      const request = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      }

      const existingUser = new User(
        1,
        'Existing User',
        'existing@example.com',
        'hashedPassword',
        new Date(),
        new Date(),
      )

      userRepository.findByEmail.mockResolvedValue(existingUser)

      await expect(useCase.execute(request)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.EMAIL_EXISTS()),
      )
      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email)
      expect(userRepository.create).not.toHaveBeenCalled()
    })

    it('should create user without password when not provided', async () => {
      const request = {
        name: 'Test User',
        email: 'test@example.com',
      }

      const mockUser = new User(
        1,
        request.name,
        request.email,
        '',
        new Date(),
        new Date(),
      )

      userRepository.findByEmail.mockResolvedValue(null)
      userRepository.create.mockResolvedValue(mockUser)

      const result = await useCase.execute(request as CreateUserRequest)

      expect(mockBcrypt.hash).not.toHaveBeenCalled()
      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email)
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: request.name,
          email: request.email,
          password: '',
        }),
      )
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
      })
    })
  })
})
