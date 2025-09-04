import { ColumnOptions } from 'typeorm'
import { isTest } from '../utils/env.util'

export const columnDate = (opts: ColumnOptions = {}): ColumnOptions => ({
  type: isTest() ? 'datetime' : 'timestamp',
  ...opts,
})
