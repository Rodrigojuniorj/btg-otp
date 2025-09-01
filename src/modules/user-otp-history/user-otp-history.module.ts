import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserOtpHistoryRepositoryPort } from './repositories/port/user-otp-history.repository.port'
import { UserOtpHistoryRepository } from './repositories/user-otp-history.repository'
import { UserOtpHistoryService } from './user-otp-history.service'
import { UserOtpHistory } from './entities/user-otp-history.entity'
import { EnvConfigService } from '@/common/service/env/env-config.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserOtpHistory])],
  providers: [
    UserOtpHistoryService,
    EnvConfigService,
    {
      provide: UserOtpHistoryRepositoryPort,
      useClass: UserOtpHistoryRepository,
    },
  ],
  exports: [UserOtpHistoryService],
})
export class UserOtpHistoryModule {}
