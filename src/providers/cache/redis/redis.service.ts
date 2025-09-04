import { EnvConfigService } from '@/common/service/env/env-config.service'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(config: EnvConfigService) {
    super({
      host: config.get('REDIS_HOST'),
      port: config.get('REDIS_PORT'),
      db: config.get('REDIS_DB'),
      password: config.get('REDIS_PASSWORD'),
    })

    super.on('error', (err) => {
      console.log('Error on Redis')
      console.log(err)
      process.exit(1)
    })
  }

  onModuleDestroy() {
    return this.disconnect()
  }
}
