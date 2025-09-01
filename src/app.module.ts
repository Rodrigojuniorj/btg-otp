import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AuthModule } from './modules/auth/auth.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Env, envSchema } from './common/service/env/env'
import { EnvConfigModule } from './common/service/env/env-config.module'
import { DatabaseModule } from './config/database/database.module'
import { EnvConfigService } from './common/service/env/env-config.service'
import { GlobalJwtAuthGuard } from './common/guards/global-jwt-auth.guard'
import { BullModule } from '@nestjs/bullmq'
import { UserOtpHistoryModule } from './modules/user-otp-history/user-otp-history.module'
import { UsersModule } from './modules/users/users.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validate: (env) => {
        return envSchema.parse(env)
      },
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => ({
        connection: {
          host: configService.get('REDIS_HOST', { infer: true }),
          port: configService.get('REDIS_PORT', { infer: true }),
          password: configService.get('REDIS_PASSWORD', { infer: true }),
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 1000,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    EnvConfigModule,
    AuthModule,
    DatabaseModule,
    UsersModule,
    UserOtpHistoryModule,
  ],
  controllers: [AppController],
  providers: [
    EnvConfigService,
    {
      provide: APP_GUARD,
      useClass: GlobalJwtAuthGuard,
    },
  ],
  exports: [EnvConfigService],
})
export class AppModule {}
