import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'
import { OtpPurpose, OtpStatus } from '../enums/otp.enum'
import { columnDate } from '../../../common/db/column-date.util'

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  hash: string

  @Column({ type: 'varchar', length: 10 })
  otpCode: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  identifier: string

  @Column({ type: 'simple-enum', enum: OtpPurpose })
  purpose: OtpPurpose

  @Column({ type: 'simple-enum', enum: OtpStatus, default: OtpStatus.PENDING })
  status: OtpStatus

  @Column({ type: 'int', default: 0 })
  attempts: number

  @Column(columnDate({ name: 'expires_at' }))
  expiresAt: Date

  @Column(columnDate({ nullable: true, name: 'validated_at' }))
  validatedAt: Date

  @CreateDateColumn(columnDate({ name: 'created_at' }))
  createdAt: Date

  @UpdateDateColumn(columnDate({ name: 'updated_at' }))
  updatedAt: Date
}
