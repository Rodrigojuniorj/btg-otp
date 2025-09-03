import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import helmet from 'helmet'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-time-zone',
    credentials: false,
  })

  const envConfigService = app.get(EnvConfigService)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const documentationPrefix = envConfigService.get('DOCUMENTATION_PREFIX')
  app.setGlobalPrefix(documentationPrefix)

  app.use(helmet())

  const config = new DocumentBuilder()
    .setTitle('BTG OTP')
    .setDescription('API para gestão de segurança de usando token OTP')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
      },
      'Bearer',
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(documentationPrefix + '/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  app.getHttpAdapter().get(`/${documentationPrefix}/docs/json`, (req, res) => {
    res.send(document)
  })

  await app.listen(envConfigService.get('PORT'))
}
bootstrap()
