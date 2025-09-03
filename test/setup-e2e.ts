/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { webcrypto } from 'crypto'
;(global as any).crypto = webcrypto

process.env.NODE_ENV = 'test'

// Mock do ioredis para testes
jest.mock('ioredis', () => {
  class MockRedis {
    private data: Map<string, unknown> = new Map()
    private listeners: Map<string, Array<(...args: unknown[]) => void>> =
      new Map()

    constructor() {
      // Constructor vazio para mock
    }

    get(key: string) {
      return Promise.resolve(this.data.get(key) || null)
    }

    set(key: string, value: unknown, ttl?: unknown) {
      this.data.set(key, value)
      if (ttl && typeof ttl === 'number') {
        setTimeout(() => this.data.delete(key), ttl * 1000)
      }
      return Promise.resolve('OK')
    }

    del(key: string) {
      const deleted = this.data.has(key)
      this.data.delete(key)
      return Promise.resolve(deleted ? 1 : 0)
    }

    expire(key: string, seconds: number) {
      if (this.data.has(key)) {
        setTimeout(() => this.data.delete(key), seconds * 1000)
        return Promise.resolve(1)
      }
      return Promise.resolve(0)
    }

    exists(key: string) {
      return Promise.resolve(this.data.has(key) ? 1 : 0)
    }

    keys(pattern: string) {
      const regex = new RegExp(pattern.replace('*', '.*'))
      const matchingKeys = Array.from(this.data.keys()).filter((key) =>
        regex.test(key as string),
      )
      return Promise.resolve(matchingKeys)
    }

    on(event: string, callback: (...args: unknown[]) => void) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, [])
      }
      this.listeners.get(event)!.push(callback)
    }

    emit(event: string, ...args: unknown[]) {
      const callbacks = this.listeners.get(event) || []
      callbacks.forEach((callback) => callback(...args))
    }

    scan(cursor: string, pattern: string) {
      const keys = Array.from(this.data.keys()).filter((key) =>
        key.includes(pattern),
      )
      return Promise.resolve([cursor, keys])
    }

    disconnect() {
      this.data.clear()
      this.listeners.clear()
    }

    incr(key: string) {
      const current = parseInt((this.data.get(key) as string) || '0')
      const newValue = current + 1
      this.data.set(key, newValue.toString())
      return Promise.resolve(newValue)
    }

    decr(key: string) {
      const current = parseInt((this.data.get(key) as string) || '0')
      const newValue = Math.max(0, current - 1)
      this.data.set(key, newValue.toString())
      return Promise.resolve(newValue)
    }

    ttl(key: string) {
      return Promise.resolve(this.data.has(key) ? -1 : -2)
    }
  }

  return { Redis: MockRedis }
})

// Mock do bullmq para testes
jest.mock('bullmq', () => {
  class FakeQueue {
    constructor(..._args: any[]) {}

    add(..._args: any[]) {
      return Promise.resolve()
    }

    addBulk(..._args: any[]) {
      return Promise.resolve([])
    }

    pause() {
      return Promise.resolve()
    }

    close() {
      return Promise.resolve()
    }

    on() {}

    waitUntilReady() {
      return Promise.resolve()
    }
  }

  class FakeWorker {
    constructor(..._args: any[]) {}

    on() {}

    close() {
      return Promise.resolve()
    }

    waitUntilReady() {
      return Promise.resolve()
    }
  }

  class FakeQueueEvents {
    constructor(..._args: any[]) {}

    on() {}

    close() {
      return Promise.resolve()
    }
  }

  return { Queue: FakeQueue, Worker: FakeWorker, QueueEvents: FakeQueueEvents }
})
