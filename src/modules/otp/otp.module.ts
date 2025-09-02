import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Otp } from './entities/otp.entity'
import { OtpRepository } from './repositories/otp.repository'
import { CacheModule } from '@/providers/cache/cache.module'
import { EmailProviderModule } from '@/providers/email/email.provider.module'
import { OtpController } from './otp.controller'
import { OtpService } from './otp.service'
import { EnvConfigService } from '@/common/service/env/env-config.service'

@Module({
  imports: [TypeOrmModule.forFeature([Otp]), CacheModule, EmailProviderModule],
  controllers: [OtpController],
  providers: [OtpService, OtpRepository, EnvConfigService],
  exports: [OtpService],
})
export class OtpModule {}
