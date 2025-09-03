import 'crypto'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '@/app.module'
import { OtpPurpose } from '@/modules/otp/enums/otp.enum'

describe('OtpController (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/otp/create (POST)', () => {
    it('should create OTP successfully', () => {
      const createOtpDto = {
        email: 'test@example.com',
        purpose: OtpPurpose.GENERAL,
      }

      return request(app.getHttpServer())
        .post('/otp/create')
        .send(createOtpDto)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toBeDefined()
          expect(response.body).toHaveProperty('hash')
          expect(response.body).toHaveProperty('otpCode')
          expect(response.body).toHaveProperty('identifier')
          expect(response.body).toHaveProperty('purpose')
          expect(response.body).toHaveProperty('expiresAt')
        })
    })

    it('should create OTP with different purpose', () => {
      const createOtpDto = {
        email: 'verification@example.com',
        purpose: OtpPurpose.VERIFICATION,
      }

      return request(app.getHttpServer())
        .post('/otp/create')
        .send(createOtpDto)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toBeDefined()
          expect(response.body.purpose).toBe(OtpPurpose.VERIFICATION)
          expect(response.body.identifier).toBe(createOtpDto.email)
        })
    })

    it('should return 400 Bad Request for invalid email format', () => {
      const invalidDto = {
        email: 'invalid-email',
        purpose: OtpPurpose.GENERAL,
      }

      return request(app.getHttpServer())
        .post('/otp/create')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('should return 400 Bad Request for missing email', () => {
      const invalidDto = {
        purpose: OtpPurpose.GENERAL,
      }

      return request(app.getHttpServer())
        .post('/otp/create')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('should return 400 Bad Request for missing purpose', () => {
      const invalidDto = {
        email: 'test@example.com',
      }

      return request(app.getHttpServer())
        .post('/otp/create')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('should return 400 Bad Request for invalid purpose', () => {
      const invalidDto = {
        email: 'test@example.com',
        purpose: 'invalid-purpose',
      }

      return request(app.getHttpServer())
        .post('/otp/create')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST)
    })
  })

  describe('/otp/validate (POST)', () => {
    let validHash: string
    let validOtpCode: string

    beforeAll(async () => {
      const createOtpDto = {
        email: 'validation@example.com',
        purpose: OtpPurpose.GENERAL,
      }

      const response = await request(app.getHttpServer())
        .post('/otp/create')
        .send(createOtpDto)

      validHash = response.body.hash
      validOtpCode = response.body.otpCode
    })

    it('should validate OTP successfully', () => {
      const validateOtpDto = {
        otpCode: validOtpCode,
        hash: validHash,
      }

      return request(app.getHttpServer())
        .post('/otp/validate')
        .send(validateOtpDto)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toBeDefined()
          expect(response.body).toHaveProperty('message')
          expect(response.body.message).toBe('OTP validado com sucesso')
        })
    })

    it('should return 400 Bad Request for missing OTP code', () => {
      const invalidDto = {
        hash: validHash,
      }

      return request(app.getHttpServer())
        .post('/otp/validate')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('should return 400 Bad Request for missing hash', () => {
      const invalidDto = {
        otpCode: validOtpCode,
      }

      return request(app.getHttpServer())
        .post('/otp/validate')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('should return 401 Unauthorized for invalid OTP code format', () => {
      const invalidDto = {
        otpCode: '12345',
        hash: validHash,
      }

      return request(app.getHttpServer())
        .post('/otp/validate')
        .send(invalidDto)
        .expect(HttpStatus.UNAUTHORIZED)
    })

    it('should return 401 Unauthorized for invalid OTP code', () => {
      const invalidDto = {
        otpCode: '999999',
        hash: validHash,
      }

      return request(app.getHttpServer())
        .post('/otp/validate')
        .send(invalidDto)
        .expect(HttpStatus.UNAUTHORIZED)
    })

    it('should return 401 Unauthorized for invalid hash', () => {
      const invalidDto = {
        otpCode: validOtpCode,
        hash: 'invalid-hash',
      }

      return request(app.getHttpServer())
        .post('/otp/validate')
        .send(invalidDto)
        .expect(HttpStatus.UNAUTHORIZED)
    })
  })

  describe('/otp/status/:hash (GET)', () => {
    let validHash: string

    beforeAll(async () => {
      const createOtpDto = {
        email: 'status@example.com',
        purpose: OtpPurpose.GENERAL,
      }

      const response = await request(app.getHttpServer())
        .post('/otp/create')
        .send(createOtpDto)

      validHash = response.body.hash
    })

    it('should return OTP status successfully', () => {
      return request(app.getHttpServer())
        .get(`/otp/status/${validHash}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toBeDefined()
          expect(response.body).toHaveProperty('status')
          expect(response.body).toHaveProperty('expiresAt')
        })
    })

    it('should return 404 Not Found for invalid hash', () => {
      return request(app.getHttpServer())
        .get('/otp/status/invalid-hash')
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toBeDefined()
          expect(response.body).toHaveProperty('message')
          expect(response.body.message).toBe('OTP não encontrado')
        })
    })

    it('should return 404 Not Found for non-existent hash', () => {
      return request(app.getHttpServer())
        .get('/otp/status/abc123def456ghi789')
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toBeDefined()
          expect(response.body).toHaveProperty('message')
          expect(response.body.message).toBe('OTP não encontrado')
        })
    })
  })

  describe('OTP lifecycle', () => {
    it('should create, validate, and check status of OTP', async () => {
      const createOtpDto = {
        email: 'lifecycle@example.com',
        purpose: OtpPurpose.VERIFICATION,
      }

      const createResponse = await request(app.getHttpServer())
        .post('/otp/create')
        .send(createOtpDto)
        .expect(HttpStatus.CREATED)

      const { hash, otpCode } = createResponse.body

      await request(app.getHttpServer())
        .get(`/otp/status/${hash}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body.status).toBe('pending')
        })

      await request(app.getHttpServer())
        .post('/otp/validate')
        .send({ otpCode, hash })
        .expect(HttpStatus.OK)

      await request(app.getHttpServer())
        .get(`/otp/status/${hash}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body.status).toBe('validated')
        })
    })
  })
})
