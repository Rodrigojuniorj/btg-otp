import { Test, TestingModule } from '@nestjs/testing'
import { RedisCacheRepository } from '../redis-cache-repository'
import { RedisService } from '../redis.service'

describe('RedisCacheRepository', () => {
  let repository: RedisCacheRepository

  const mockRedisService = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    scan: jest.fn(),
    getIsDevelopment: jest.fn().mockReturnValue(false),
  }

  let redisService: typeof mockRedisService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisCacheRepository,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile()

    repository = module.get<RedisCacheRepository>(RedisCacheRepository)
    redisService = module.get(RedisService)

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(repository).toBeDefined()
  })

  it('should implement CacheRepository', () => {
    expect(repository).toBeInstanceOf(RedisCacheRepository)
  })

  describe('set', () => {
    it('should set key with default expiration', async () => {
      const key = 'test-key'
      const value = 'test-value'

      await repository.set(key, value)

      expect(redisService.set).toHaveBeenCalledWith(key, value, 'EX', 900)
    })

    it('should set key with custom expiration', async () => {
      const key = 'test-key'
      const value = 'test-value'
      const seconds = 3600

      await repository.set(key, value, seconds)

      expect(redisService.set).toHaveBeenCalledWith(key, value, 'EX', seconds)
    })

    it('should set key with zero expiration', async () => {
      const key = 'test-key'
      const value = 'test-value'
      const seconds = 0

      await repository.set(key, value, seconds)

      expect(redisService.set).toHaveBeenCalledWith(key, value, 'EX', seconds)
    })
  })

  describe('get', () => {
    it('should get value by key', async () => {
      const key = 'test-key'
      const expectedValue = 'test-value'

      redisService.get.mockResolvedValue(expectedValue)

      const result = await repository.get(key)

      expect(result).toBe(expectedValue)
      expect(redisService.get).toHaveBeenCalledWith(key)
    })

    it('should return null when key not found', async () => {
      const key = 'non-existent-key'

      redisService.get.mockResolvedValue(null)

      const result = await repository.get(key)

      expect(result).toBeNull()
      expect(redisService.get).toHaveBeenCalledWith(key)
    })
  })

  describe('delete', () => {
    it('should delete key', async () => {
      const key = 'test-key'

      await repository.delete(key)

      expect(redisService.del).toHaveBeenCalledWith(key)
    })
  })

  describe('keys', () => {
    it('should get keys by pattern', async () => {
      const pattern = 'user:*'
      const expectedKeys = ['user:1', 'user:2', 'user:3']

      redisService.keys.mockResolvedValue(expectedKeys)

      const result = await repository.keys(pattern)

      expect(result).toEqual(expectedKeys)
      expect(redisService.keys).toHaveBeenCalledWith(pattern)
    })

    it('should return empty array when no keys match pattern', async () => {
      const pattern = 'non-existent:*'

      redisService.keys.mockResolvedValue([])

      const result = await repository.keys(pattern)

      expect(result).toEqual([])
      expect(redisService.keys).toHaveBeenCalledWith(pattern)
    })
  })

  describe('scanKeys', () => {
    it('should scan keys by pattern', async () => {
      const pattern = 'session:*'
      const mockScanResults: [string, string[]][] = [
        ['1', ['session:1', 'session:2']],
        ['0', ['session:3']],
      ]

      redisService.scan
        .mockResolvedValueOnce(mockScanResults[0])
        .mockResolvedValueOnce(mockScanResults[1])

      const result = await repository.scanKeys(pattern)

      expect(result).toEqual(['session:1', 'session:2', 'session:3'])
      expect(redisService.scan).toHaveBeenCalledWith('0', 'MATCH', pattern)
      expect(redisService.scan).toHaveBeenCalledWith('1', 'MATCH', pattern)
    })

    it('should handle single scan result', async () => {
      const pattern = 'single:*'
      const mockScanResult: [string, string[]] = ['0', ['single:1']]

      redisService.scan.mockResolvedValue(mockScanResult)

      const result = await repository.scanKeys(pattern)

      expect(result).toEqual(['single:1'])
      expect(redisService.scan).toHaveBeenCalledWith('0', 'MATCH', pattern)
    })
  })

  describe('invalidateCache', () => {
    it('should invalidate cache by pattern', async () => {
      const pattern = 'user:*'
      const mockKeys = ['user:1', 'user:2', 'user:3']

      jest.spyOn(repository, 'scanKeys').mockResolvedValue(mockKeys)
      jest.spyOn(repository, 'delete').mockResolvedValue()

      await repository.invalidateCache(pattern)

      expect(repository.scanKeys).toHaveBeenCalledWith(pattern)
      expect(repository.delete).toHaveBeenCalledTimes(3)
      expect(repository.delete).toHaveBeenCalledWith('user:1')
      expect(repository.delete).toHaveBeenCalledWith('user:2')
      expect(repository.delete).toHaveBeenCalledWith('user:3')
    })

    it('should handle empty pattern result', async () => {
      const pattern = 'empty:*'
      const mockKeys: string[] = []

      jest.spyOn(repository, 'scanKeys').mockResolvedValue(mockKeys)
      jest.spyOn(repository, 'delete').mockResolvedValue()

      await repository.invalidateCache(pattern)

      expect(repository.scanKeys).toHaveBeenCalledWith(pattern)
      expect(repository.delete).not.toHaveBeenCalled()
    })
  })
})
