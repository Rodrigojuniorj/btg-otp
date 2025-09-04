import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Not } from 'typeorm'
import { OtpEntity } from './otp.entity'
import { OtpMapper } from './otp.mapper'
import { OtpRepositoryPort } from '../../domain/repositories/otp.repository.port'
import { Otp } from '../../domain/entities/otp.entity'
import { OtpPurpose, OtpStatus } from '../../domain/enums/otp.enum'

@Injectable()
export class OtpRepository implements OtpRepositoryPort {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly repository: Repository<OtpEntity>,
  ) {}

  async create(otp: Otp): Promise<Otp> {
    const entity = this.repository.create(OtpMapper.toEntity(otp))
    const savedEntity = await this.repository.save(entity)
    return OtpMapper.toDomain(savedEntity)
  }

  async findByHash(hash: string): Promise<Otp | null> {
    const entity = await this.repository.findOne({
      where: { hash },
    })

    if (!entity) {
      return null
    }

    return OtpMapper.toDomain(entity)
  }

  async findActiveByIdentifier(identifier: string): Promise<Otp | null> {
    const entity = await this.repository.findOne({
      where: {
        identifier,
        status: Not(OtpStatus.VALIDATED),
      },
      order: { expiresAt: 'DESC' },
    })

    if (!entity) {
      return null
    }

    return OtpMapper.toDomain(entity)
  }

  async updateStatus(id: number, status: OtpStatus): Promise<void> {
    const updateData: Partial<OtpEntity> = { status }

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
