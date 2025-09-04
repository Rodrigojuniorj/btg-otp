import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Not } from 'typeorm'
import { Otp } from '../entities/otp.entity'
import { OtpPurpose, OtpStatus } from '../enums/otp.enum'
import { OtpDto } from '../dto/otp.dto'
import { OtpRepositoryPort } from './port/otp.repository.port'

@Injectable()
export class OtpRepository extends OtpRepositoryPort {
  constructor(
    @InjectRepository(Otp)
    private readonly repository: Repository<Otp>,
  ) {
    super()
  }

  async create(otpData: Partial<OtpDto>): Promise<OtpDto> {
    const otp = this.repository.create({
      ...otpData,
      status: OtpStatus.PENDING,
    })

    return this.repository.save(otp)
  }

  async findByHash(hash: string): Promise<OtpDto | null> {
    return this.repository.findOne({
      where: { hash },
    })
  }

  async findActiveByIdentifier(identifier: string): Promise<OtpDto | null> {
    return this.repository.findOne({
      where: {
        identifier,
        status: Not(OtpStatus.VALIDATED),
      },
      order: { expiresAt: 'DESC' },
    })
  }

  async updateStatus(id: number, status: OtpStatus): Promise<void> {
    const updateData: Partial<Otp> = { status }

    if (status === OtpStatus.VALIDATED) {
      updateData.validatedAt = new Date()
    }

    await this.repository.update(id, updateData)
  }

  async incrementAttempts(id: number): Promise<void> {
    await this.repository.increment({ id }, 'attempts', 1)
  }

  async expireOldOtps(identifier: string, purpose: OtpPurpose): Promise<void> {
    await this.repository.update(
      {
        identifier,
        status: OtpStatus.PENDING,
        purpose,
      },
      { status: OtpStatus.EXPIRED },
    )
  }

  async deleteExpiredOtps(): Promise<void> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    await this.repository.delete({
      createdAt: thirtyDaysAgo,
      status: OtpStatus.EXPIRED,
    })
  }
}
