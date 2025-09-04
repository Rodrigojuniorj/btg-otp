import { Injectable } from '@nestjs/common'
import { CacheRepository } from '../cache-repository'
import { RedisService } from './redis.service'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string, seconds = 900): Promise<void> {
    await this.redis.set(key, value, 'EX', seconds)
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async scanKeys(pattern: string): Promise<string[]> {
    const keys: string[] = []
    let cursor = '0'
    do {
      const result = await this.redis.scan(cursor, 'MATCH', pattern)
      cursor = result[0]
      keys.push(...result[1])
    } while (cursor !== '0')
    return keys
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.redis.keys(pattern)
  }

  async invalidateCache(pattern: string): Promise<void> {
    const keys = await this.scanKeys(pattern)

    for (const key of keys) {
      await this.delete(key)
    }
  }
}
