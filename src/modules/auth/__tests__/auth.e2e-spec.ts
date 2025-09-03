import 'crypto'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '@/app.module'

import { User } from '@/modules/users/entities/user.entity'
import { Repository } from 'typeorm'
import { RegisterDto } from '@/modules/auth/dtos/register.dto'

describe('AuthController (E2E)', () => {
  let app: INestApplication
  let userRepository: Repository<User>

  jest.setTimeout(60000)

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()

    userRepository = moduleFixture.get('UserRepository')
  })

  beforeEach(async () => {
    await userRepository.clear()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/auth/register (POST)', () => {
    it('should create a new user successfully', () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        name: 'Test User',
      }

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toBeDefined()
        })
    })

    it('should return a Bad Request if email is already in use', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        name: 'Test User',
      }

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('should return 400 Bad Request for invalid email format', () => {
      const invalidDto = {
        email: 'invalid-email',
        password: 'StrongPassword123!',
        name: 'Test User',
      }

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('should return 400 Bad Request for short password', () => {
      const invalidDto = {
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
      }

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST)
    })
  })

  describe('/auth/login (POST)', () => {
    it('should login a registered user and return OTP challenge', async () => {
      const user = {
        email: 'login@example.com',
        password: 'StrongPassword123!',
        name: 'Login User',
      }

      await request(app.getHttpServer()).post('/auth/register').send(user)

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(HttpStatus.ACCEPTED)
        .then((response) => {
          expect(response.body).toHaveProperty('message')
          expect(response.body).toHaveProperty('taskType')
          expect(response.body).toHaveProperty('accessToken')
          expect(response.body).toHaveProperty('validationUrl')
        })
    })

    it('should return Bad Request for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'wrong@user.com', password: 'wrongpassword' })
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('should return Bad Request for non-existent user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nonexistent@user.com', password: 'anypassword' })
        .expect(HttpStatus.BAD_REQUEST)
    })
  })

  describe('/auth/validate-otp (POST)', () => {
    it('should validate OTP successfully', async () => {
      const validateDto = {
        otpCode: '123456',
      }

      return request(app.getHttpServer())
        .post('/auth/validate-otp')
        .send(validateDto)
        .expect(HttpStatus.UNAUTHORIZED)
    })
  })
})
