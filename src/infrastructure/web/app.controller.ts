import { Controller, Get } from '@nestjs/common'
import { HealthSwagger } from './swagger'
import { Public } from '@/common/decorators/public.decorator'

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @HealthSwagger.operation
  @HealthSwagger.response
  @HealthSwagger.error
  @Get('health')
  healthCheck(): { status: string } {
    return {
      status: 'UP',
    }
  }
}
