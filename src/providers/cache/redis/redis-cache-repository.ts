import { Injectable } from '@nestjs/common'
import { CacheRepository } from '../cache-repository'
import { RedisService } from './redis.service'
import { Redis, Cluster } from 'ioredis'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  private client: Redis | Cluster

  constructor(private redis: RedisService) {
    this.client = this.redis.getClient()
  }

  async set(key: string, value: string, seconds = 900): Promise<void> {
    await this.client.set(key, value, 'EX', seconds)
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key)
  }

  async scanKeys(pattern: string): Promise<string[]> {
    const keys: string[] = []
    let cursor = '0'
    do {
      const result = await this.client.scan(cursor, 'MATCH', pattern)
      cursor = result[0]
      keys.push(...result[1])
    } while (cursor !== '0')
    return keys
  }

  async keysByValue(value: string): Promise<boolean> {
    const keys = await this.scanKeys(`*${value}*`)
    return keys.length > 0
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.client.keys(pattern)
  }

  async invalidateCache(pattern: string): Promise<void> {
    const keys = await this.scanKeys(pattern)

    for (const key of keys) {
      await this.delete(key)
    }
  }
}
