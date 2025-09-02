import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from '../../modules/users/entities/user.entity'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { Otp } from '../../modules/otp/entities/otp.entity'

export const databaseConfig = (
  envConfigService: EnvConfigService,
): TypeOrmModuleOptions => {
  const nodeEnv = process.env.NODE_ENV || envConfigService.get('NODE_ENV')

  if (nodeEnv === 'test') {
    // Para testes e2e, usar SQLite em memória com configuração otimizada
    return {
      type: 'sqlite',
      database: ':memory:',
      entities: [User, Otp],
      synchronize: true,
      dropSchema: true,
      migrationsRun: false,
      logging: false,
      // Configurações para compatibilidade com SQLite
      extra: {
        // Permitir que TypeORM mapeie enums para strings
        enumAsString: true,
      },
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
    entities: [User, Otp],
    migrations: ['dist/migrations/*.js'],
    migrationsRun: true,
    synchronize: false,
    logging: envConfigService.get('NODE_ENV') !== 'production',
  }
}
