import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from '../../common/strategies/jwt.strategy'
import { EnvConfigModule } from '../../common/service/env/env-config.module'
import { UsersModule } from '../users/users.module'
import { UserOtpHistoryModule } from '../user-otp-history/user-otp-history.module'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [PassportModule, EnvConfigModule, UsersModule, UserOtpHistoryModule],
  providers: [AuthService, JwtStrategy, EnvConfigService, JwtService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
