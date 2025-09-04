import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OtpEntity } from './infrastructure/database/otp.entity'
import { OtpRepository } from './infrastructure/database/otp.repository'
import { OtpRepositoryPort } from './domain/repositories/otp.repository.port'
import { CacheModule } from '@/providers/cache/cache.module'
import { EmailProviderModule } from '@/providers/email/email.provider.module'
import { OtpController } from './infrastructure/web/otp.controller'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { CreateOtpUseCase } from './application/use-cases/create-otp.use-case'
import { ValidateOtpUseCase } from './application/use-cases/validate-otp.use-case'
import { GetOtpStatusUseCase } from './application/use-cases/get-otp-status.use-case'

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpEntity]),
    CacheModule,
    EmailProviderModule,
  ],
  controllers: [OtpController],
  providers: [
    CreateOtpUseCase,
    ValidateOtpUseCase,
    GetOtpStatusUseCase,

    OtpRepository,
    EnvConfigService,

    {
      provide: OtpRepositoryPort,
      useClass: OtpRepository,
    },
  ],
  exports: [CreateOtpUseCase, ValidateOtpUseCase, GetOtpStatusUseCase],
})
export class OtpModule {}
