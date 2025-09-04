import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AuthModule } from './modules/auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './common/service/env/env'
import { EnvConfigModule } from './common/service/env/env-config.module'
import { DatabaseModule } from './config/database/database.module'
import { EnvConfigService } from './common/service/env/env-config.service'
import { GlobalJwtAuthGuard } from './common/guards/global-jwt-auth.guard'
import { BullModule } from '@nestjs/bullmq'
import { UsersModule } from './modules/users/users.module'
import { OtpModule } from './modules/otp/otp.module'
import { JwtModule } from '@nestjs/jwt'
import { CacheModule } from './providers/cache/cache.module'

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
    CacheModule,
    BullModule.forRootAsync({
      imports: [EnvConfigModule],
      inject: [EnvConfigService],
      useFactory: (configService: EnvConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
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
      imports: [EnvConfigModule],
      inject: [EnvConfigService],
      useFactory: async (configService: EnvConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
    }),
    EnvConfigModule,
    DatabaseModule,
    UsersModule,
    OtpModule,
    AuthModule,
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
