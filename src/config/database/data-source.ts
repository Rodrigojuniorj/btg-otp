import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import { User } from '../../modules/users/entities/user.entity'
import { UserOtpHistory } from '../../modules/users/entities/user-otp-history.entity'

config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'postgres',
  schema: process.env.DB_SCHEMA || 'public',
  entities: [User, UserOtpHistory],
  migrations:
    process.env.NODE_ENV === 'production'
      ? ['dist/src/migrations/*.js']
      : ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
})
