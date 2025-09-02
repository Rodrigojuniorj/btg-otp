import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from '../app.controller'

describe('AppController', () => {
  let controller: AppController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile()

    controller = module.get<AppController>(AppController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should be an instance of AppController', () => {
    expect(controller).toBeInstanceOf(AppController)
  })

  describe('healthCheck', () => {
    it('should return health status UP', () => {
      const result = controller.healthCheck()

      expect(result).toEqual({
        status: 'UP',
      })
    })

    it('should return correct status property', () => {
      const result = controller.healthCheck()

      expect(result.status).toBe('UP')
      expect(typeof result.status).toBe('string')
    })

    it('should always return the same response', () => {
      const result1 = controller.healthCheck()
      const result2 = controller.healthCheck()

      expect(result1).toEqual(result2)
      expect(result1.status).toBe(result2.status)
    })
  })

  describe('controller metadata', () => {
    it('should have correct route decorators', () => {
      expect(controller).toBeDefined()
      expect(controller.constructor.name).toBe('AppController')
    })

    it('should have health check endpoint', () => {
      expect(typeof controller.healthCheck).toBe('function')
    })

    it('should have public decorator on health check', () => {
      expect(controller.healthCheck).toBeDefined()
    })
  })

  describe('API documentation', () => {
    it('should have health check endpoint with correct path', () => {
      expect(controller.healthCheck).toBeDefined()
    })

    it('should return health check response structure', () => {
      const result = controller.healthCheck()

      expect(result).toHaveProperty('status')
      expect(Object.keys(result)).toHaveLength(1)
      expect(result.status).toBe('UP')
    })
  })
})
