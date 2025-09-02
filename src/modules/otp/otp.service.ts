import { Injectable, HttpStatus } from '@nestjs/common'
import { OtpRepository } from './repositories/otp.repository'
import { CreateOtpDto } from './dto/create-otp.dto'
import { CreateOtpResponseDto } from './dto/create-otp-response.dto'
import { OtpPurpose, OtpStatus } from './enums/otp.enum'
import { generateOtpCode } from '@/common/utils/generate-otp-code.util'
import { generateUniqueHash } from '@/common/utils/generate-unique-hash.util'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { CustomException } from '@/common/exceptions/customException'
import { OtpDto } from './dto/otp.dto'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly envConfigService: EnvConfigService,
  ) {}

  async create(createOtpDto: CreateOtpDto): Promise<CreateOtpResponseDto> {
    const { email, purpose } = createOtpDto

    if (!email) {
      throw new CustomException(
        ErrorMessages.OTP.OTP_CREATE(),
        HttpStatus.BAD_REQUEST,
      )
    }

    const existingOtp = await this.otpRepository.findActiveByIdentifier(email)

    if (existingOtp && existingOtp.expiresAt > new Date()) {
      throw new CustomException(
        ErrorMessages.OTP.OTP_ALREADY_ACTIVE(),
        HttpStatus.CONFLICT,
      )
    }

    await this.otpRepository.expireOldOtps(email, purpose)

    const otpCode = generateOtpCode(
      this.envConfigService.get('OTP_LENGTH') || 6,
    )
    const hash = generateUniqueHash()
    const expiresAt = new Date(
      Date.now() + this.envConfigService.get('OTP_MINUTE_DURATION') * 60 * 1000,
    )

    const otpData: Partial<OtpDto> = {
      hash,
      otpCode,
      identifier: email,
      purpose: purpose || OtpPurpose.GENERAL,
      expiresAt,
      status: OtpStatus.PENDING,
    }

    await this.otpRepository.create(otpData)

    return {
      hash,
      expiresAt,
      otpCode,
      identifier: email,
      purpose: purpose || 'general',
    }
  }
}
