import { generateUniqueHash } from '../generate-unique-hash.util'

describe('generateUniqueHash', () => {
  it('should be defined', () => {
    expect(generateUniqueHash).toBeDefined()
    expect(typeof generateUniqueHash).toBe('function')
  })

  it('should generate hash without length parameter', () => {
    const result = generateUniqueHash()

    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toHaveLength(64)
  })

  it('should generate hash with specified length', () => {
    const length = 16
    const result = generateUniqueHash(length)

    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toHaveLength(length)
  })

  it('should generate hash with length 32', () => {
    const length = 32
    const result = generateUniqueHash(length)

    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toHaveLength(length)
  })

  it('should generate hash with length 8', () => {
    const length = 8
    const result = generateUniqueHash(length)

    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toHaveLength(length)
  })

  it('should generate hash with length 1', () => {
    const length = 1
    const result = generateUniqueHash(length)

    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toHaveLength(length)
  })

  it('should generate hash with length 0', () => {
    const length = 0
    const result = generateUniqueHash(length)

    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toHaveLength(64)
  })

  it('should generate different hashes on multiple calls', () => {
    const result1 = generateUniqueHash()
    const result2 = generateUniqueHash()

    expect(result1).toBeDefined()
    expect(result2).toBeDefined()
    expect(result1).not.toBe(result2)
  })

  it('should generate hex string', () => {
    const result = generateUniqueHash(16)

    expect(result).toMatch(/^[0-9a-f]+$/)
  })
})
