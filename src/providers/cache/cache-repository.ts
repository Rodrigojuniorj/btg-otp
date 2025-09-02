export abstract class CacheRepository {
  abstract set(key: string, value: string, seconds?: number): Promise<void>
  abstract get(key: string): Promise<string | null>
  abstract delete(key: string): Promise<void>
  abstract keys(pattern: string): Promise<string[]>
  abstract keysByValue(value: string): Promise<boolean>
  abstract scanKeys(pattern: string): Promise<string[]>
  abstract invalidateCache(pattern: string): Promise<void>
}
