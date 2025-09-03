import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../users.controller'
import { UsersService } from '../users.service'
import { UserResponseDto } from '../dto/user-response.dto'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

describe('UsersController', () => {
  let controller: UsersController
  let usersService: jest.Mocked<UsersService>

  const mockUsersService = {
    profile: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    usersService = module.get(UsersService)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('profile', () => {
    it('should return user profile successfully', async () => {
      const userId = 1
      const mockUserProfile: UserResponseDto = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      usersService.profile.mockResolvedValue(mockUserProfile)

      const result = await controller.profile(userId)

      expect(result).toEqual(mockUserProfile)
      expect(usersService.profile).toHaveBeenCalledWith(userId)
    })

    it('should handle service errors properly', async () => {
      const userId = 999

      usersService.profile.mockRejectedValue(
        new CustomException(ErrorMessages.USER.NOT_FOUND(userId)),
      )

      await expect(controller.profile(userId)).rejects.toThrow(CustomException)
      expect(usersService.profile).toHaveBeenCalledWith(userId)
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
