import { Env } from '@/common/service/env/env'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis, { Cluster, ClusterNode, RedisOptions } from 'ioredis'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis | Cluster
  private isDevelopment: boolean

  constructor(config: ConfigService<Env, true>) {
    this.isDevelopment =
      config.get('NODE_ENV', { infer: true }) === 'development'

    const isCluster = config.get('REDIS_CLUSTER', { infer: true })

    if (isCluster) {
      // ElastiCache Cluster Mode Enabled
      const nodes: ClusterNode[] = [
        {
          host: config.get('REDIS_HOST', { infer: true }),
          port: config.get('REDIS_PORT', { infer: true }),
        },
      ]

      this.client = new Redis.Cluster(nodes, {
        dnsLookup: (address, callback) => callback(null, address),
        redisOptions: {
          tls: {},
        },
      })
    } else {
      // Local ou Cluster Mode Disabled
      const options: RedisOptions = {
        host: config.get('REDIS_HOST', { infer: true }),
        port: config.get('REDIS_PORT', { infer: true }),
        db: config.get('REDIS_DB', { infer: true }),
        password: config.get('REDIS_PASSWORD', { infer: true }),
        tls: config.get('REDIS_TLS', { infer: true }) ? {} : undefined,
      }

      this.client = new Redis(options)
    }

    this.client.on('connect', () => {
      console.log('✅ Redis conectado')
    })

    this.client.on('error', (err) => {
      console.error('❌ Erro no Redis:', err)
      if (this.isDevelopment && process.env.NODE_ENV !== 'test') {
        process.exit(1)
      }
    })
  }

  onModuleDestroy() {
    return this.client.disconnect()
  }

  getClient(): Redis | Cluster {
    return this.client
  }

  public getIsDevelopment(): boolean {
    return this.isDevelopment
  }
}
