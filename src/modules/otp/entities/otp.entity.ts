import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'
import { OtpPurpose, OtpStatus } from '../enums/otp.enum'

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

  @Column({ type: 'enum', enum: OtpPurpose })
  purpose: OtpPurpose

  @Column({ type: 'enum', enum: OtpStatus, default: OtpStatus.PENDING })
  status: OtpStatus

  @Column({ type: 'int', default: 0 })
  attempts: number

  @Column({ type: 'timestamp' })
  expiresAt: Date

  @Column({ type: 'timestamp', nullable: true })
  validatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
