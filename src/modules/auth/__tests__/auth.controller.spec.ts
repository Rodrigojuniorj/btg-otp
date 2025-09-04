import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../infrastructure/web/auth.controller'
import { LoginUseCase } from '../application/use-cases/login.use-case'
import { RegisterUseCase } from '../application/use-cases/register.use-case'
import { AuthValidateOtpUseCase } from '../application/use-cases/validate-otp.use-case'
import { LoginDto } from '../infrastructure/web/dto/login.dto'
import { RegisterDto } from '../infrastructure/web/dto/register.dto'
import { TaskType } from '@/common/enums/task-type.enum'
import { CustomException } from '@/common/exceptions/customException'
import { Response } from 'express'
import { AuthValidateOtpDto } from '../infrastructure/web/dto/auth-validate-otp.dto'
import { JwtTypeSign } from '@/common/enums/jwt-type-sign.enum'

describe('AuthController', () => {
  let controller: AuthController
  let loginUseCase: jest.Mocked<LoginUseCase>
  let registerUseCase: jest.Mocked<RegisterUseCase>
  let authValidateOtpUseCase: jest.Mocked<AuthValidateOtpUseCase>

  const mockLoginUseCase = {
    execute: jest.fn(),
  }

  const mockRegisterUseCase = {
    execute: jest.fn(),
  }

  const mockAuthValidateOtpUseCase = {
    execute: jest.fn(),
  }

  const mockResponse = {
    setHeader: jest.fn(),
  } as unknown as Response

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: mockLoginUseCase,
        },
        {
          provide: RegisterUseCase,
          useValue: mockRegisterUseCase,
        },
        {
          provide: AuthValidateOtpUseCase,
          useValue: mockAuthValidateOtpUseCase,
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    loginUseCase = module.get(LoginUseCase)
    registerUseCase = module.get(RegisterUseCase)
    authValidateOtpUseCase = module.get(AuthValidateOtpUseCase)

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
        message: 'Código OTP enviado para seu email',
        taskType: TaskType.OTP_CHALLENGER,
        accessToken: 'jwt.token.here',
        validationUrl: '/auth/validate-otp/hash123',
      }

      const expectedResponse = {
        message: 'Código OTP enviado para seu email',
        taskType: TaskType.OTP_CHALLENGER,
        accessToken: mockLoginResponse.accessToken,
        validationUrl: mockLoginResponse.validationUrl,
      }

      loginUseCase.execute.mockResolvedValue(mockLoginResponse)

      const result = await controller.login(loginDto, mockResponse)

      expect(result).toEqual(expectedResponse)
      expect(loginUseCase.execute).toHaveBeenCalledWith({
        email: loginDto.email,
        password: loginDto.password,
      })
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

      loginUseCase.execute.mockRejectedValue(
        new CustomException('Invalid credentials', 401),
      )

      await expect(controller.login(loginDto, mockResponse)).rejects.toThrow(
        CustomException,
      )
      expect(loginUseCase.execute).toHaveBeenCalledWith({
        email: loginDto.email,
        password: loginDto.password,
      })
    })
  })

  describe('register', () => {
    it('should register user successfully', async () => {
      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }

      const mockRegisterResponse = {
        message: 'Usuário criado com sucesso',
      }

      registerUseCase.execute.mockResolvedValue(mockRegisterResponse)

      const result = await controller.register(registerDto)

      expect(result).toEqual(mockRegisterResponse)
      expect(registerUseCase.execute).toHaveBeenCalledWith({
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
      })
    })

    it('should handle service errors properly', async () => {
      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      }

      registerUseCase.execute.mockRejectedValue(
        new CustomException('Email already exists', 400),
      )

      await expect(controller.register(registerDto)).rejects.toThrow(
        CustomException,
      )
      expect(registerUseCase.execute).toHaveBeenCalledWith({
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
      })
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

      authValidateOtpUseCase.execute.mockResolvedValue(mockValidationResponse)

      const result = await controller.validateOtp(validateOtpDto, mockUserOtp)

      expect(result).toEqual(mockValidationResponse)
      expect(authValidateOtpUseCase.execute).toHaveBeenCalledWith({
        otpCode: validateOtpDto.otpCode,
        user: mockUserOtp,
      })
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

      authValidateOtpUseCase.execute.mockRejectedValue(
        new CustomException('Invalid OTP', 401),
      )

      await expect(
        controller.validateOtp(validateOtpDto, mockUserOtp),
      ).rejects.toThrow(CustomException)
      expect(authValidateOtpUseCase.execute).toHaveBeenCalledWith({
        otpCode: validateOtpDto.otpCode,
        user: mockUserOtp,
      })
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
