import { generateOtpCode } from '../generate-otp-code.util'

describe('generateOtpCode', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should generate OTP code with specified length', () => {
    const length = 6
    const result = generateOtpCode(length)

    expect(result).toHaveLength(length)
    expect(typeof result).toBe('string')
  })

  it('should generate 6-digit OTP code by default', () => {
    const result = generateOtpCode(6)

    expect(result).toHaveLength(6)
    expect(parseInt(result)).toBeGreaterThanOrEqual(100000)
    expect(parseInt(result)).toBeLessThanOrEqual(999999)
  })

  it('should generate 4-digit OTP code', () => {
    const result = generateOtpCode(4)

    expect(result).toHaveLength(4)
    expect(parseInt(result)).toBeGreaterThanOrEqual(1000)
    expect(parseInt(result)).toBeLessThanOrEqual(9999)
  })

  it('should generate 8-digit OTP code', () => {
    const result = generateOtpCode(8)

    expect(result).toHaveLength(8)
    expect(parseInt(result)).toBeGreaterThanOrEqual(10000000)
    expect(parseInt(result)).toBeLessThanOrEqual(99999999)
  })

  it('should generate numeric string', () => {
    const result = generateOtpCode(6)

    expect(/^\d+$/.test(result)).toBe(true)
  })

  it('should generate different codes on multiple calls', () => {
    const mockRandom = jest.spyOn(Math, 'random')
    mockRandom
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.9)

    const result1 = generateOtpCode(6)
    const result2 = generateOtpCode(6)
    const result3 = generateOtpCode(6)

    expect(result1).not.toBe(result2)
    expect(result2).not.toBe(result3)
    expect(result1).not.toBe(result3)

    mockRandom.mockRestore()
  })

  it('should handle edge case with length 1', () => {
    const result = generateOtpCode(1)

    expect(result).toHaveLength(1)
    expect(parseInt(result)).toBeGreaterThanOrEqual(1)
    expect(parseInt(result)).toBeLessThanOrEqual(9)
  })

  it('should handle edge case with length 2', () => {
    const result = generateOtpCode(2)

    expect(result).toHaveLength(2)
    expect(parseInt(result)).toBeGreaterThanOrEqual(10)
    expect(parseInt(result)).toBeLessThanOrEqual(99)
  })

  it('should generate code within correct range', () => {
    const length = 5
    const result = generateOtpCode(length)
    const numResult = parseInt(result)

    const min = Math.pow(10, length - 1)
    const max = Math.pow(10, length) - 1

    expect(numResult).toBeGreaterThanOrEqual(min)
    expect(numResult).toBeLessThanOrEqual(max)
  })
})
