import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { UserOTPHistoryStatus } from '../enums/user-otp-history.enum'

@Entity('user_otp_history')
export class UserOtpHistory {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', name: 'user_id' })
  userId: number

  @Column({ type: 'varchar', name: 'hash', length: 255 })
  hash: string

  @Column({ type: 'varchar', length: 100, name: 'otp_code' })
  otpCode: string

  @Column({
    type: 'varchar',
    name: 'status',
    enum: UserOTPHistoryStatus,
    default: UserOTPHistoryStatus.PENDING,
  })
  status: UserOTPHistoryStatus

  @Column({
    type: 'timestamp',
    name: 'sent_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  sentAt: Date

  @Column({ type: 'timestamp', name: 'validated_at', nullable: true })
  validatedAt: Date

  @Column({ type: 'int', name: 'attempts', default: 0 })
  attempts: number

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User
}
