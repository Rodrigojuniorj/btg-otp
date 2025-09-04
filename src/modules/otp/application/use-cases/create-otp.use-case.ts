import { Injectable, HttpStatus } from '@nestjs/common'
import { OtpRepositoryPort } from '../../domain/repositories/otp.repository.port'
import { Otp } from '../../domain/entities/otp.entity'
import { OtpPurpose } from '../../domain/enums/otp.enum'
import { generateOtpCode } from '@/common/utils/generate-otp-code.util'
import { generateUniqueHash } from '@/common/utils/generate-unique-hash.util'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import {
  CreateOtpRequest,
  CreateOtpResponse,
} from '../interfaces/create-otp.interface'

@Injectable()
export class CreateOtpUseCase {
  constructor(
    private readonly otpRepository: OtpRepositoryPort,
    private readonly envConfigService: EnvConfigService,
  ) {}

  async execute(request: CreateOtpRequest): Promise<CreateOtpResponse> {
    const { email, purpose = OtpPurpose.GENERAL } = request

    if (!email) {
      throw new CustomException(
        ErrorMessages.OTP.OTP_CREATE(),
        HttpStatus.BAD_REQUEST,
      )
    }

    const existingOtp = await this.otpRepository.findActiveByIdentifier(email)

    if (existingOtp && existingOtp.isNotExpired()) {
      throw new CustomException(
        ErrorMessages.OTP.OTP_ALREADY_ACTIVE(),
        HttpStatus.CONFLICT,
      )
    }

    await this.otpRepository.expireOldOtps(email, purpose)

    const otpCode = generateOtpCode(this.envConfigService.get('OTP_LENGTH'))
    const hash = generateUniqueHash()
    const expiresAt = new Date(
      Date.now() + this.envConfigService.get('OTP_MINUTE_DURATION') * 60 * 1000,
    )

    const otp = Otp.create(hash, otpCode, email, purpose, expiresAt)

    await this.otpRepository.create(otp)

    return {
      hash,
      expiresAt,
      otpCode,
      identifier: email,
      purpose,
    }
  }
}
