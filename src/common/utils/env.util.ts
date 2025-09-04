import { ConfigService } from '@nestjs/config'
import { Env } from '../service/env/env'
import { EnvConfigService } from '../service/env/env-config.service'
import { NodeEnv } from '../enums/node-env.enum'

let envConfigServiceInstance: EnvConfigService | null = null

export const getEnvConfigService = (): EnvConfigService => {
  if (!envConfigServiceInstance) {
    const configService = new ConfigService<Env, true>()
    envConfigServiceInstance = new EnvConfigService(configService)
  }

  return envConfigServiceInstance
}

export const isTest = (): boolean => {
  return getEnvConfigService().get('NODE_ENV') === NodeEnv.TEST
}

export const isProduction = (): boolean => {
  return getEnvConfigService().get('NODE_ENV') === NodeEnv.PRODUCTION
}

export const isDevelopment = (): boolean => {
  return getEnvConfigService().get('NODE_ENV') === NodeEnv.DEVELOPMENT
}
