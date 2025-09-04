import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { OtpRepositoryPort } from '../../domain/repositories/otp.repository.port'
import { OtpStatus } from '../../domain/enums/otp.enum'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { ValidateOtpRequest } from '../interfaces/validate-otp.interface'

@Injectable()
export class ValidateOtpUseCase {
  private readonly logger = new Logger(ValidateOtpUseCase.name)

  constructor(
    private readonly otpRepository: OtpRepositoryPort,
    private readonly envConfigService: EnvConfigService,
  ) {}

  async execute(request: ValidateOtpRequest): Promise<void> {
    const { otpCode, hash } = request

    const otp = await this.otpRepository.findByHash(hash)

    if (!otp) {
      throw new CustomException(
        ErrorMessages.OTP.INVALID_OTP(),
        HttpStatus.UNAUTHORIZED,
      )
    }

    if (otp.isUsed()) {
      throw new CustomException(
        ErrorMessages.OTP.OTP_USED(),
        HttpStatus.UNAUTHORIZED,
      )
    }

    if (otp.isExpired()) {
      await this.otpRepository.updateStatus(otp.id, OtpStatus.EXPIRED)
      throw new CustomException(
        ErrorMessages.OTP.OTP_EXPIRED(),
        HttpStatus.UNAUTHORIZED,
      )
    }

    const maxAttempts = this.envConfigService.get('OTP_MAX_ATTEMPTS')
    if (otp.isMaxAttemptsReached(maxAttempts)) {
      await this.otpRepository.updateStatus(otp.id, OtpStatus.FAILED)
      this.logger.log(
        `${ErrorMessages.OTP.MAX_ATTEMPTS_EXCEEDED()}, ID: ${otp.id}`,
      )
      throw new CustomException(
        ErrorMessages.OTP.MAX_ATTEMPTS_EXCEEDED(),
        HttpStatus.UNAUTHORIZED,
      )
    }

    if (otp.otpCode !== otpCode) {
      await this.otpRepository.incrementAttempts(otp.id)
      throw new CustomException(
        ErrorMessages.OTP.INVALID_OTP_CODE(),
        HttpStatus.UNAUTHORIZED,
      )
    }

    await this.otpRepository.updateStatus(otp.id, OtpStatus.VALIDATED)
  }
}
