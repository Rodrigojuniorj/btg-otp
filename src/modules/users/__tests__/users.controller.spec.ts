import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../infrastructure/web/users.controller'
import { FindUserByIdUseCase } from '../application/use-cases/find-user-by-id.use-case'
import { UserProfileResponseDto } from '../infrastructure/web/dto/user-profile-response.dto'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

describe('UsersController', () => {
  let controller: UsersController
  let findUserByIdUseCase: jest.Mocked<FindUserByIdUseCase>

  const mockFindUserByIdUseCase = {
    execute: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: FindUserByIdUseCase,
          useValue: mockFindUserByIdUseCase,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    findUserByIdUseCase = module.get(FindUserByIdUseCase)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('profile', () => {
    it('should return user profile successfully', async () => {
      const userId = 1
      const mockUserProfile: UserProfileResponseDto = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      findUserByIdUseCase.execute.mockResolvedValue(mockUserProfile)

      const result = await controller.profile(userId)

      expect(result).toEqual(mockUserProfile)
      expect(findUserByIdUseCase.execute).toHaveBeenCalledWith({ id: userId })
    })

    it('should handle use case errors properly', async () => {
      const userId = 999

      findUserByIdUseCase.execute.mockRejectedValue(
        new CustomException(ErrorMessages.USER.NOT_FOUND(userId)),
      )

      await expect(controller.profile(userId)).rejects.toThrow(CustomException)
      expect(findUserByIdUseCase.execute).toHaveBeenCalledWith({ id: userId })
    })
  })

  describe('controller metadata', () => {
    it('should have correct route decorators', () => {
      expect(controller).toBeDefined()
      expect(controller.constructor.name).toBe('UsersController')
    })

    it('should have correct HTTP methods', () => {
      expect(typeof controller.profile).toBe('function')
    })
  })
})
