import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { LoginUseCase } from './application/use-cases/login.use-case'
import { RegisterUseCase } from './application/use-cases/register.use-case'
import { AuthValidateOtpUseCase } from './application/use-cases/validate-otp.use-case'
import { JwtStrategy } from '../../common/strategies/jwt.strategy'
import { EnvConfigModule } from '../../common/service/env/env-config.module'
import { UsersModule } from '../users/users.module'
import { OtpModule } from '../otp/otp.module'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { JwtService } from '@nestjs/jwt'
import { CacheModule } from '@/providers/cache/cache.module'
import { EmailProviderModule } from '@/providers/email/email.provider.module'
import { AuthController } from './infrastructure/web/auth.controller'

@Module({
  imports: [
    PassportModule,
    EnvConfigModule,
    UsersModule,
    OtpModule,
    CacheModule,
    EmailProviderModule,
  ],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    AuthValidateOtpUseCase,
    JwtStrategy,
    EnvConfigService,
    JwtService,
  ],
  controllers: [AuthController],
  exports: [LoginUseCase, RegisterUseCase, AuthValidateOtpUseCase],
})
export class AuthModule {}
