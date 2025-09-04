import { EnvConfigService } from '@/common/service/env/env-config.service'
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name)

  constructor(config: EnvConfigService) {
    super({
      host: config.get('REDIS_HOST'),
      port: config.get('REDIS_PORT'),
      db: config.get('REDIS_DB'),
      password: config.get('REDIS_PASSWORD'),
    })

    super.on('error', (err) => {
      this.logger.error('Error on Redis', err)
      process.exit(1)
    })
  }

  onModuleInit() {
    this.logger.log('Redis connected')
  }

  onModuleDestroy() {
    return this.disconnect()
  }
}
