import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import { User } from '../../modules/users/entities/user.entity'
import { Otp } from '../../modules/otp/entities/otp.entity'
import { NodeEnv } from '../../common/enums/node-env.enum'

config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'postgres',
  schema: process.env.DB_SCHEMA || 'public',
  entities: [User, Otp],
  ssl:
    process.env.NODE_ENV === NodeEnv.PRODUCTION
      ? {
          rejectUnauthorized: false,
        }
      : false,
  migrations:
    process.env.NODE_ENV === NodeEnv.PRODUCTION
      ? ['dist/migrations/*.js']
      : ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV !== NodeEnv.PRODUCTION,
})
