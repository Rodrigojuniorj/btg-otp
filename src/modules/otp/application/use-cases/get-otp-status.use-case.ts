import { Injectable } from '@nestjs/common'
import { OtpRepositoryPort } from '../../domain/repositories/otp.repository.port'
import { GetOtpStatusResponse } from '../interfaces/get-otp-status.interface'

@Injectable()
export class GetOtpStatusUseCase {
  constructor(private readonly otpRepository: OtpRepositoryPort) {}

  async execute(hash: string): Promise<GetOtpStatusResponse | null> {
    const otp = await this.otpRepository.findByHash(hash)

    if (!otp) {
      return null
    }

    return {
      status: otp.status,
      expiresAt: otp.expiresAt,
    }
  }
}
