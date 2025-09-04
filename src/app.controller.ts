import { Controller, Get } from '@nestjs/common'
import { Public } from './common/decorators/public.decorator'
import { HealthSwagger } from './swagger'

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
