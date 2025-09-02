import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { UserOtpHistoryRepositoryPort } from './port/user-otp-history.repository.port'
import { UserOtpHistory } from '../entities/user-otp-history.entity'
import { CreateUserOtpHistoryDto } from '../dto/create-user-otp-history.dto'
import { UserOTPHistoryStatus } from '../enums/user-otp-history.enum'
import { UserOtpHistoryDto } from '../dto/user-otp-history.dto'

@Injectable()
export class UserOtpHistoryRepository extends UserOtpHistoryRepositoryPort {
  constructor(
    @InjectRepository(UserOtpHistory)
    private readonly repository: Repository<UserOtpHistory>,
  ) {
    super()
  }

  async create(
    createUserOtpHistoryDto: CreateUserOtpHistoryDto,
  ): Promise<UserOtpHistoryDto> {
    const otpHistory = this.repository.create({
      userId: createUserOtpHistoryDto.userId,
      hash: createUserOtpHistoryDto.hash,
      otpCode: createUserOtpHistoryDto.otpCode,
      expiresAt: createUserOtpHistoryDto.expiresAt,
      status: UserOTPHistoryStatus.PENDING,
    })

    return this.repository.save(otpHistory)
  }

  async findByHash(hash: string): Promise<UserOtpHistoryDto | null> {
    return this.repository.findOne({
      where: { hash },
      relations: ['user'],
    })
  }

  async updateStatus(id: number, status: UserOTPHistoryStatus): Promise<void> {
    const updateData: Partial<UserOtpHistory> = { status }

    if (status === UserOTPHistoryStatus.VALIDATED) {
      updateData.validatedAt = new Date()
    }

    await this.repository.update(id, updateData)
  }

  async incrementAttempts(id: number): Promise<void> {
    await this.repository.increment({ id }, 'attempts', 1)
  }

  async findPendingByUserId(userId: number): Promise<UserOtpHistoryDto | null> {
    return this.repository.findOne({
      where: {
        userId,
        status: UserOTPHistoryStatus.PENDING,
      },
    })
  }

  async findByUserId(userId: number): Promise<UserOtpHistoryDto | null> {
    return this.repository.findOne({
      where: { userId, status: Not(UserOTPHistoryStatus.VALIDATED) },
      order: { expiresAt: 'DESC' },
    })
  }

  async expireOldOtps(userId: number): Promise<void> {
    await this.repository.update(
      {
        userId,
        status: UserOTPHistoryStatus.PENDING,
      },
      { status: UserOTPHistoryStatus.EXPIRED },
    )
  }
}
