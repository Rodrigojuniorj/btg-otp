import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from '../../common/strategies/jwt.strategy'
import { EnvConfigModule } from '../../common/service/env/env-config.module'
import { UsersModule } from '../users/users.module'
import { UserOtpHistoryModule } from '../user-otp-history/user-otp-history.module'
import { EnvConfigService } from '@/common/service/env/env-config.service'

@Module({
  imports: [
    PassportModule,
    EnvConfigModule,
    UsersModule,
    UserOtpHistoryModule,
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
  ],
  providers: [AuthService, JwtStrategy, EnvConfigService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
