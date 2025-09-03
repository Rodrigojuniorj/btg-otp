import { configure as serverlessExpress } from '@vendia/serverless-express'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvConfigService } from './common/service/env/env-config.service'
import helmet from 'helmet'
import { ValidationPipe } from '@nestjs/common'

let cachedServer

export const handler = async (event, context) => {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule)

    nestApp.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization, x-time-zone',
      credentials: false,
    })
    nestApp.useGlobalPipes(new ValidationPipe({ transform: true }))

    const documentationPrefix = nestApp
      .get(EnvConfigService)
      .get('DOCUMENTATION_PREFIX')
    nestApp.setGlobalPrefix(documentationPrefix)

    nestApp.use(helmet())
    await nestApp.init()

    cachedServer = serverlessExpress({
      app: nestApp.getHttpAdapter().getInstance(),
    })
  }

  return cachedServer(event, context)
}
