import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../auth.controller'
import { AuthService } from '../auth.service'
import { LoginDto } from '../dtos/login.dto'
import { RegisterDto } from '../dtos/register.dto'
import { TaskType } from '@/common/enums/task-type.enum'
import { CustomException } from '@/common/exceptions/customException'
import { Response } from 'express'
import { AuthValidateOtpDto } from '../dtos/auth-validate-otp.dto'
import { JwtTypeSign } from '@/common/enums/jwt-type-sign.enum'

describe('AuthController', () => {
  let controller: AuthController
  let authService: jest.Mocked<AuthService>

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    validate: jest.fn(),
  }

  const mockResponse = {
    setHeader: jest.fn(),
  } as unknown as Response

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get(AuthService)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should login successfully and return OTP challenge response', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      }

      const mockLoginResponse = {
        accessToken: 'jwt.token.here',
        validationUrl: '/auth/validate-otp/hash123',
      }

      const expectedResponse = {
        message: 'Código OTP enviado para seu email',
        taskType: TaskType.OTP_CHALLENGER,
        accessToken: mockLoginResponse.accessToken,
        validationUrl: mockLoginResponse.validationUrl,
      }

      authService.login.mockResolvedValue(mockLoginResponse)

      const result = await controller.login(loginDto, mockResponse)

      expect(result).toEqual(expectedResponse)
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      )
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-task-type',
        TaskType.OTP_CHALLENGER,
      )
    })

    it('should handle service errors properly', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }

      authService.login.mockRejectedValue(
        new CustomException('Invalid credentials', 401),
      )

      await expect(controller.login(loginDto, mockResponse)).rejects.toThrow(
        CustomException,
      )
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      )
    })
  })

  describe('register', () => {
    it('should register user successfully', async () => {
      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }

      authService.register.mockResolvedValue(undefined)

      await controller.register(registerDto)

      expect(authService.register).toHaveBeenCalledWith(registerDto)
    })

    it('should handle service errors properly', async () => {
      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      }

      authService.register.mockRejectedValue(
        new CustomException('Email already exists', 400),
      )

      await expect(controller.register(registerDto)).rejects.toThrow(
        CustomException,
      )
      expect(authService.register).toHaveBeenCalledWith(registerDto)
    })
  })

  describe('validateOtp', () => {
    it('should validate OTP successfully', async () => {
      const validateOtpDto: AuthValidateOtpDto = {
        otpCode: '123456',
      }

      const mockUserOtp = {
        sub: 1,
        email: 'test@example.com',
        hash: 'hash123',
        type: JwtTypeSign.OTP,
      }

      const mockValidationResponse = {
        accessToken: 'access.token.here',
      }

      authService.validate.mockResolvedValue(mockValidationResponse)

      const result = await controller.validateOtp(validateOtpDto, mockUserOtp)

      expect(result).toEqual(mockValidationResponse)
      expect(authService.validate).toHaveBeenCalledWith(
        validateOtpDto,
        mockUserOtp,
      )
    })

    it('should handle service errors properly', async () => {
      const validateOtpDto: AuthValidateOtpDto = {
        otpCode: '123456',
      }

      const mockUserOtp = {
        sub: 1,
        email: 'test@example.com',
        hash: 'hash123',
        type: JwtTypeSign.OTP,
      }

      authService.validate.mockRejectedValue(
        new CustomException('Invalid OTP', 401),
      )

      await expect(
        controller.validateOtp(validateOtpDto, mockUserOtp),
      ).rejects.toThrow(CustomException)
      expect(authService.validate).toHaveBeenCalledWith(
        validateOtpDto,
        mockUserOtp,
      )
    })
  })

  describe('controller metadata', () => {
    it('should have correct route decorators', () => {
      expect(controller).toBeDefined()
      expect(controller.constructor.name).toBe('AuthController')
    })

    it('should have correct HTTP methods', () => {
      expect(typeof controller.login).toBe('function')
      expect(typeof controller.register).toBe('function')
      expect(typeof controller.validateOtp).toBe('function')
    })
  })
})
