import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from '../../modules/users/entities/user.entity'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { OtpEntity } from '../../modules/otp/infrastructure/database/otp.entity'
import { NodeEnv } from '../../common/enums/node-env.enum'

export const databaseConfig = (
  envConfigService: EnvConfigService,
): TypeOrmModuleOptions => {
  if (envConfigService.get('NODE_ENV') === NodeEnv.TEST) {
    return {
      type: 'sqlite',
      database: ':memory:',
      entities: [User, OtpEntity],
      synchronize: true,
      dropSchema: true,
      migrationsRun: false,
      logging: false,
      extra: {
        enumAsString: true,
      },
      autoLoadEntities: true,
    }
  }

  return {
    type: 'postgres',
    host: envConfigService.get('DB_HOST'),
    port: parseInt(envConfigService.get('DB_PORT')),
    username: envConfigService.get('DB_USERNAME'),
    password: envConfigService.get('DB_PASSWORD'),
    database: envConfigService.get('DB_DATABASE'),
    schema: envConfigService.get('DB_SCHEMA'),
    entities: [User, OtpEntity],
    migrations: ['dist/migrations/*.js'],
    migrationsRun: true,
    synchronize: false,
    ssl:
      envConfigService.get('NODE_ENV') === NodeEnv.PRODUCTION
        ? {
            rejectUnauthorized: false,
          }
        : false,
    logging: envConfigService.get('NODE_ENV') !== NodeEnv.PRODUCTION,
  }
}
