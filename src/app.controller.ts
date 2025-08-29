import { Controller, Get } from '@nestjs/common'
import { Public } from './common/decorators/public.decorator'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Health check' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get('health')
  healthCheck(): { status: string } {
    return {
      status: 'UP',
    }
  }
}
