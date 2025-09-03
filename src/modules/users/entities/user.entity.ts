import { columnDate } from '../../../common/db/column-date.util'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar', length: 255 })
  password: string

  @CreateDateColumn(columnDate({ name: 'created_at' }))
  createdAt: Date

  @UpdateDateColumn(columnDate({ name: 'updated_at' }))
  updatedAt: Date
}
