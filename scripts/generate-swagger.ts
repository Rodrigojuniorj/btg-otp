import { NestFactory } from '@nestjs/core'
import { AppModule } from '../src/app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces'
import { EnvConfigService } from '../src/common/service/env/env-config.service'

async function generateSwaggerDocs() {
  console.log('📚 Gerando documentação Swagger estática...')

  try {
    // Criar app temporário apenas para gerar docs
    const app = await NestFactory.create(AppModule, { logger: false })

    // Obter configurações de ambiente
    const envConfigService = app.get(EnvConfigService)
    const documentationPrefix = envConfigService.get('DOCUMENTATION_PREFIX')
    const serverUrl = envConfigService.get('SERVER_URL')

    // NÃO aplicar prefixo global aqui, pois as rotas já vêm com o prefixo correto
    // app.setGlobalPrefix(documentationPrefix)

    const config = new DocumentBuilder()
      .setTitle('BTG OTP API')
      .setDescription('API para gestão de segurança usando token OTP')
      .setVersion('1.0')
      .addServer(`${serverUrl}/${documentationPrefix}`, 'Produção')
      .addServer(
        `http://localhost:3333/${documentationPrefix}`,
        'Desenvolvimento Local',
      )
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

    // Criar diretório se não existir
    const docsDir = join(__dirname, '../dist/docs')
    mkdirSync(docsDir, { recursive: true })

    // Salvar JSON do Swagger
    const swaggerJsonPath = join(docsDir, 'swagger.json')
    writeFileSync(swaggerJsonPath, JSON.stringify(document, null, 2))
    console.log(`✅ Swagger JSON salvo em: ${swaggerJsonPath}`)

    // Gerar HTML estático
    const htmlContent = generateSwaggerHTML(document)
    const swaggerHtmlPath = join(docsDir, 'index.html')
    writeFileSync(swaggerHtmlPath, htmlContent)
    console.log(`✅ Swagger HTML salvo em: ${swaggerHtmlPath}`)

    await app.close()
    console.log('🎉 Documentação Swagger gerada com sucesso!')
    console.log(`🔗 URL da API: ${serverUrl}/${documentationPrefix}`)
    console.log(
      `📚 Swagger disponível em: ${serverUrl}/${documentationPrefix}/docs`,
    )
  } catch (error) {
    console.error('❌ Erro ao gerar documentação:', error)
    process.exit(1)
  }
}

function generateSwaggerHTML(document: OpenAPIObject): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BTG OTP API - Documentação</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin:0; background: #fafafa; }
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { color: #3b4151; font-size: 36px; }
        .swagger-ui .info .description { font-size: 16px; }
        .swagger-ui .servers { margin: 20px 0; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                spec: ${JSON.stringify(document)},
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                persistAuthorization: true,
                tryItOutEnabled: true,
                defaultModelsExpandDepth: 3,
                defaultModelExpandDepth: 3
            });
        };
    </script>
</body>
</html>`
}

generateSwaggerDocs()
