import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from '../../modules/users/entities/user.entity'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { UserOtpHistory } from '../../modules/user-otp-history/entities/user-otp-history.entity'

export const databaseConfig = (
  envConfigService: EnvConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: envConfigService.get('DB_HOST'),
    port: parseInt(envConfigService.get('DB_PORT')),
    username: envConfigService.get('DB_USERNAME'),
    password: envConfigService.get('DB_PASSWORD'),
    database: envConfigService.get('DB_DATABASE'),
    schema: envConfigService.get('DB_SCHEMA'),
    entities: [User, UserOtpHistory],
    migrations: ['dist/migrations/*.js'],
    migrationsRun: true,
    synchronize: false,
    logging: envConfigService.get('NODE_ENV') !== 'production',
  }
}
