import { Env } from '@/common/service/env/env'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private isDevelopment: boolean

  constructor(config: ConfigService<Env, true>) {
    super({
      host: config.get('REDIS_HOST', { infer: true }),
      port: config.get('REDIS_PORT', { infer: true }),
      db: config.get('REDIS_DB', { infer: true }),
      password: config.get('REDIS_PASSWORD', { infer: true }),
    })

    this.isDevelopment =
      config.get('NODE_ENV', { infer: true }) === 'development'

    super.on('error', (err) => {
      console.log(err)
      if (this.isDevelopment && process.env.NODE_ENV !== 'test') {
        process.exit(1)
      }
    })
  }

  onModuleDestroy() {
    return this.disconnect()
  }

  public getIsDevelopment(): boolean {
    return this.isDevelopment
  }
}
