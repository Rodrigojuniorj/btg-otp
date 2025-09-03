import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '../users.service'
import { UserRepositoryPort } from '../repositories/port/user.repository.port'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { UserResponseDto } from '../dto/user-response.dto'
import { UserResponsePasswordDto } from '../dto/user-response-password.dto'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import * as bcrypt from 'bcryptjs'
import { UserDto } from '../dto/user.dto'

jest.mock('bcryptjs')
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('UsersService', () => {
  let service: UsersService
  let userRepository: jest.Mocked<UserRepositoryPort>

  const mockUserRepository = {
    findByEmail: jest.fn(),
    findByEmailAndPassword: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepositoryPort,
          useValue: mockUserRepository,
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    userRepository = module.get(UserRepositoryPort)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('findByEmail', () => {
    it('should find user by email successfully', async () => {
      const email = 'test@example.com'
      const mockUser: UserResponseDto = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      userRepository.findByEmail.mockResolvedValue(mockUser as UserDto)

      const result = await service.findByEmail(email)

      expect(result).toEqual(mockUser)
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email)
    })

    it('should return null when user is not found', async () => {
      const email = 'nonexistent@example.com'

      userRepository.findByEmail.mockResolvedValue(null)

      const result = await service.findByEmail(email)

      expect(result).toBeNull()
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email)
    })
  })

  describe('findByEmailAndPassword', () => {
    it('should find user by email and password successfully', async () => {
      const email = 'test@example.com'
      const mockUser: UserResponsePasswordDto = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      userRepository.findByEmailAndPassword.mockResolvedValue(mockUser)

      const result = await service.findByEmailAndPassword(email)

      expect(result).toEqual(mockUser)
      expect(userRepository.findByEmailAndPassword).toHaveBeenCalledWith(email)
    })

    it('should return null when user is not found', async () => {
      const email = 'nonexistent@example.com'

      userRepository.findByEmailAndPassword.mockResolvedValue(null)

      const result = await service.findByEmailAndPassword(email)

      expect(result).toBeNull()
      expect(userRepository.findByEmailAndPassword).toHaveBeenCalledWith(email)
    })
  })

  describe('profile', () => {
    it('should return user profile successfully', async () => {
      const userId = 1
      const mockUser: UserResponsePasswordDto = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      userRepository.findById.mockResolvedValue(mockUser as UserDto)

      const result = await service.profile(userId)

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      })
      expect(userRepository.findById).toHaveBeenCalledWith(userId)
    })

    it('should throw error when user is not found', async () => {
      const userId = 999

      userRepository.findById.mockResolvedValue(null)

      await expect(service.profile(userId)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.NOT_FOUND(userId)),
      )
      expect(userRepository.findById).toHaveBeenCalledWith(userId)
    })
  })

  describe('findById', () => {
    it('should find user by id successfully', async () => {
      const userId = 1
      const mockUser: UserResponseDto = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      userRepository.findById.mockResolvedValue(mockUser as UserDto)

      const result = await service.findById(userId)

      expect(result).toEqual(mockUser)
      expect(userRepository.findById).toHaveBeenCalledWith(userId)
    })

    it('should throw error when user is not found', async () => {
      const userId = 999

      userRepository.findById.mockResolvedValue(null)

      await expect(service.findById(userId)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.NOT_FOUND(userId)),
      )
      expect(userRepository.findById).toHaveBeenCalledWith(userId)
    })
  })

  describe('create', () => {
    it('should create user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      }

      const hashedPassword = 'hashedPassword123'
      mockBcrypt.hash.mockResolvedValue(hashedPassword as never)
      userRepository.create.mockResolvedValue(undefined)

      await service.create(createUserDto)

      expect(mockBcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10)
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      })
    })
  })

  describe('update', () => {
    it('should update user successfully', async () => {
      const userId = 1
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        email: 'updated@example.com',
      }

      const mockUser: UserResponseDto = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      userRepository.findById.mockResolvedValue(mockUser as UserDto)
      userRepository.update.mockResolvedValue(undefined)

      await service.update(userId, updateUserDto)

      expect(userRepository.findById).toHaveBeenCalledWith(userId)
      expect(userRepository.update).toHaveBeenCalledWith(userId, updateUserDto)
    })

    it('should throw error when user is not found', async () => {
      const userId = 999
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
      }

      userRepository.findById.mockResolvedValue(null)

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.NOT_FOUND(userId)),
      )
      expect(userRepository.findById).toHaveBeenCalledWith(userId)
    })
  })

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const userId = 1

      const mockUser: UserResponseDto = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      userRepository.findById.mockResolvedValue(mockUser as UserDto)
      userRepository.delete.mockResolvedValue(undefined)

      await service.delete(userId)

      expect(userRepository.findById).toHaveBeenCalledWith(userId)
      expect(userRepository.delete).toHaveBeenCalledWith(userId)
    })

    it('should throw error when user is not found', async () => {
      const userId = 999

      userRepository.findById.mockResolvedValue(null)

      await expect(service.delete(userId)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.NOT_FOUND(userId)),
      )
      expect(userRepository.findById).toHaveBeenCalledWith(userId)
    })
  })

  describe('findAll', () => {
    it('should return all users successfully', async () => {
      const mockUsers: UserResponseDto[] = [
        {
          id: 1,
          email: 'user1@example.com',
          name: 'User 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          email: 'user2@example.com',
          name: 'User 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      userRepository.findAll.mockResolvedValue(mockUsers)

      const result = await service.findAll()

      expect(result).toEqual(mockUsers)
      expect(userRepository.findAll).toHaveBeenCalled()
    })

    it('should return empty array when no users exist', async () => {
      userRepository.findAll.mockResolvedValue([])

      const result = await service.findAll()

      expect(result).toEqual([])
      expect(userRepository.findAll).toHaveBeenCalled()
    })
  })
})
