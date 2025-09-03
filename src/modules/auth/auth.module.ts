import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from '../../common/strategies/jwt.strategy'
import { EnvConfigModule } from '../../common/service/env/env-config.module'
import { UsersModule } from '../users/users.module'
import { OtpModule } from '../otp/otp.module'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { JwtService } from '@nestjs/jwt'
import { CacheModule } from '@/providers/cache/cache.module'
import { EmailProviderModule } from '@/providers/email/email.provider.module'

@Module({
  imports: [
    PassportModule,
    EnvConfigModule,
    UsersModule,
    OtpModule,
    CacheModule,
    EmailProviderModule,
  ],
  providers: [AuthService, JwtStrategy, EnvConfigService, JwtService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
