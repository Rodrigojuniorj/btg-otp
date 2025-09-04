import { Test, TestingModule } from '@nestjs/testing'
import { RegisterUseCase } from '../application/use-cases/register.use-case'
import { FindUserByEmailAndPasswordUseCase } from '../../users/application/use-cases/find-user-by-email-and-password.use-case'
import { CreateUserUseCase } from '../../users/application/use-cases/create-user.use-case'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase
  let findUserByEmailAndPasswordUseCase: jest.Mocked<FindUserByEmailAndPasswordUseCase>
  let createUserUseCase: jest.Mocked<CreateUserUseCase>

  const mockFindUserByEmailAndPasswordUseCase = {
    execute: jest.fn(),
  }

  const mockCreateUserUseCase = {
    execute: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUseCase,
        {
          provide: FindUserByEmailAndPasswordUseCase,
          useValue: mockFindUserByEmailAndPasswordUseCase,
        },
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
      ],
    }).compile()

    useCase = module.get<RegisterUseCase>(RegisterUseCase)
    findUserByEmailAndPasswordUseCase = module.get(
      FindUserByEmailAndPasswordUseCase,
    )
    createUserUseCase = module.get(CreateUserUseCase)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should register user successfully', async () => {
      const request = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }

      findUserByEmailAndPasswordUseCase.execute.mockResolvedValue(null)
      createUserUseCase.execute.mockResolvedValue({
        id: 1,
        name: request.name,
        email: request.email,
        createdAt: new Date(),
      })

      const result = await useCase.execute(request)

      expect(result).toEqual({
        message: 'Usuário criado com sucesso',
      })

      expect(findUserByEmailAndPasswordUseCase.execute).toHaveBeenCalledWith({
        email: request.email,
        password: '',
      })
      expect(createUserUseCase.execute).toHaveBeenCalledWith({
        name: request.name,
        email: request.email,
        password: request.password,
      })
    })

    it('should throw error when email already exists', async () => {
      const request = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      }

      const existingUser = {
        id: 1,
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      findUserByEmailAndPasswordUseCase.execute.mockResolvedValue(existingUser)

      await expect(useCase.execute(request)).rejects.toThrow(
        new CustomException(ErrorMessages.USER.EMAIL_EXISTS()),
      )

      expect(findUserByEmailAndPasswordUseCase.execute).toHaveBeenCalledWith({
        email: request.email,
        password: '',
      })
      expect(createUserUseCase.execute).not.toHaveBeenCalled()
    })
  })
})
