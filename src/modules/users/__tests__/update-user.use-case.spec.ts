import { Test, TestingModule } from '@nestjs/testing'
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case'
import { UserRepositoryPort } from '../domain/repositories/user.repository.port'
import { User } from '../domain/entities/user.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import * as bcrypt from 'bcryptjs'

jest.mock('bcryptjs')
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase
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
        UpdateUserUseCase,
        {
          provide: UserRepositoryPort,
          useValue: mockUserRepository,
        },
      ],
    }).compile()

    useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase)
    userRepository = module.get(UserRepositoryPort)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should update user successfully', async () => {
      const request = {
        id: 1,
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword123',
      }

      const existingUser = new User(
        1,
        'Old User',
        'old@example.com',
        'oldHashedPassword',
        new Date(),
        new Date(),
      )

      const updatedUser = new User(
        1,
        request.name,
        request.email,
        'newHashedPassword',
        existingUser.createdAt,
        new Date(),
      )

      const hashedPassword = 'newHashedPassword'

      userRepository.findById.mockResolvedValue(existingUser)
      userRepository.findByEmail.mockResolvedValue(null)
      mockBcrypt.hash.mockResolvedValue(hashedPassword as never)
      userRepository.update.mockResolvedValue(updatedUser)

      const result = await useCase.execute(request)

      expect(result).toEqual({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        updatedAt: updatedUser.updatedAt,
      })

      expect(userRepository.findById).toHaveBeenCalledWith(request.id)
      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email)
      expect(mockBcrypt.hash).toHaveBeenCalledWith(request.password, 10)
      expect(userRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: request.id,
          name: request.name,
          email: request.email,
          password: hashedPassword,
        }),
      )
    })

    it('should update user without password when not provided', async () => {
      const request = {
        id: 1,
        name: 'Updated User',
        email: 'updated@example.com',
      }

      const existingUser = new User(
        1,
        'Old User',
        'old@example.com',
        'oldHashedPassword',
        new Date(),
        new Date(),
      )

      const updatedUser = new User(
        1,
        request.name,
        request.email,
        existingUser.password,
        existingUser.createdAt,
        new Date(),
      )

      userRepository.findById.mockResolvedValue(existingUser)
      userRepository.findByEmail.mockResolvedValue(null)
      userRepository.update.mockResolvedValue(updatedUser)

      const result = await useCase.execute(request)

      expect(result).toEqual({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        updatedAt: updatedUser.updatedAt,
      })

      expect(userRepository.findById).toHaveBeenCalledWith(request.id)
      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email)
      expect(mockBcrypt.hash).not.toHaveBeenCalled()
      expect(userRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: request.id,
          name: request.name,
          email: request.email,
          password: existingUser.password,
        }),
      )
    })

    it('should throw error when user is not found', async () => {
      const request = {
        id: 999,
        name: 'Updated User',
      }

      userRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute(request)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.NOT_FOUND(request.id)),
      )

      expect(userRepository.findById).toHaveBeenCalledWith(request.id)
      expect(userRepository.update).not.toHaveBeenCalled()
    })

    it('should throw error when email already exists for another user', async () => {
      const request = {
        id: 1,
        name: 'Updated User',
        email: 'existing@example.com',
      }

      const existingUser = new User(
        1,
        'Old User',
        'old@example.com',
        'oldHashedPassword',
        new Date(),
        new Date(),
      )

      const anotherUser = new User(
        2,
        'Another User',
        'existing@example.com',
        'hashedPassword',
        new Date(),
        new Date(),
      )

      userRepository.findById.mockResolvedValue(existingUser)
      userRepository.findByEmail.mockResolvedValue(anotherUser)

      await expect(useCase.execute(request)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.EMAIL_EXISTS()),
      )

      expect(userRepository.findById).toHaveBeenCalledWith(request.id)
      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email)
      expect(userRepository.update).not.toHaveBeenCalled()
    })
  })
})
