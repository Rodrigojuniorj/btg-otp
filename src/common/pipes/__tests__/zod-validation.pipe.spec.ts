import { BadRequestException } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { ZodValidationPipe } from '../zod-validation.pipe'

describe('ZodValidationPipe', () => {
  const mockSchema = {
    parse: jest.fn(),
  } as unknown as jest.Mocked<ZodSchema>

  let pipe: ZodValidationPipe

  beforeEach(() => {
    jest.clearAllMocks()
    pipe = new ZodValidationPipe(mockSchema)
  })

  it('should be defined', () => {
    expect(pipe).toBeDefined()
  })

  describe('transform', () => {
    it('should return the value correctly if validation is successful', () => {
      const validValue = { name: 'John Doe' }
      mockSchema.parse.mockReturnValue(validValue)

      const result = pipe.transform(validValue)

      expect(result).toEqual(validValue)
      expect(mockSchema.parse).toHaveBeenCalledWith(validValue)
      expect(mockSchema.parse).toHaveBeenCalledTimes(1)
    })

    it('should throw a formatted BadRequestException if validation fails with a ZodError', () => {
      const invalidValue = { name: 123 }
      const zodError = new ZodError([])
      mockSchema.parse.mockImplementation(() => {
        throw zodError
      })

      expect(() => pipe.transform(invalidValue)).toThrow(BadRequestException)

      try {
        pipe.transform(invalidValue)
      } catch (error) {
        expect(error.getStatus()).toBe(400)
        expect(error.getResponse().message).toBe('Validation failed')
        expect(error.getResponse()).toHaveProperty('errors')
      }
    })

    it('should throw a generic BadRequestException for non-Zod errors', () => {
      const value = {}
      const genericError = new Error('Something went wrong')
      mockSchema.parse.mockImplementation(() => {
        throw genericError
      })

      expect(() => pipe.transform(value)).toThrow(BadRequestException)

      try {
        pipe.transform(value)
      } catch (error) {
        expect(error.getStatus()).toBe(400)

        expect(error.message).toBe('Validation failed')
      }
    })
  })
})
