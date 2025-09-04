# 🔐 BTG OTP – API de Autenticação Segura com Token OTP

## 📌 Objetivo do Projeto

Este projeto tem como propósito oferecer uma solução segura de autenticação e validação utilizando **códigos OTP (One-Time Password)**.  
A API foi desenvolvida como um **MVP de back-end** com foco em:

- Emissão e validação de **códigos OTP**
- Login protegido por **dupla autenticação (e-mail + OTP)**
- Gestão de usuários e autenticação JWT

---

## 🚀 Funcionalidades Principais

### ✅ Health Check

- Endpoint para verificar a saúde da aplicação.

### 👤 Usuários

- Consulta de perfil do usuário autenticado.

### 🔑 Autenticação

- **Registro de novos usuários** com senha criptografada.
- **Login com e-mail e senha**, retornando um **desafio OTP** enviado por e-mail.
- **Validação de OTP** com geração de **JWT de acesso** para uso nas rotas autenticadas.

### 🧾 OTP (One-Time Password)

- **Criação de OTP** associado a um identificador (ex.: e-mail).
- **Validação de OTP** por código e hash.
- **Consulta de status de OTP** (pendente, validado, expirado, falhou).

---

## 🔒 Segurança

- Autenticação via **JWT** para todas as rotas protegidas.
- Envio de OTP **via e-mail** com expiração configurada.
- Validação robusta de dados de entrada.

---

## 🏗️ Tecnologias Utilizadas

- **Node.js / NestJS**
- **TypeScript**
- **PostgreSQL**
- **Jest** (testes unitários e e2e)
- **JWT** (autenticação segura)
- **Docker & Docker Compose** (orquestração de containers)

---

## 🛠️ Como Executar o Projeto com Docker Compose

### Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Passos para execução com Docker

```bash
# Clone o repositório
git clone https://github.com/Rodrigojuniorj/btg-otp.git

# Acesse a pasta
cd btg-otp

# Construa e inicie os containers
docker-compose up -d --build
```

A aplicação estará disponível em:  
👉 `http://localhost:3333/api/v1/btg`

Documentação Swagger:  
👉 `http://localhost:3333/api/v1/btg/docs`

Sendo a porta configurada pelo usuário na env assim como path da API.  
Aqui no Readme vou seguir com o path api/v1/btg, afim de exemplos

```
PORT=3333
DOCUMENTATION_PREFIX=api/v1/btg
```

---

## ⚙️ Configuração de Variáveis de Ambiente (.env)

Antes de executar o projeto, é necessário configurar as variáveis de ambiente.

1. Copie o arquivo de exemplo:

   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e configure de acordo com seu ambiente.

### Exemplo de `.env.example`

```env
# Configuração da Aplicação
PORT=3333
DOCUMENTATION_PREFIX=api/v1/btg

# Banco de Dados
POSTGRES_USER=example_user
POSTGRES_PASSWORD=example_password
POSTGRES_DB=example_db
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# SMTP (necessário para envio de OTP por e-mail)
SMTP_HOST=smtp.example.com
PORT_EMAIL=465
SECURE_EMAIL=true
USER_EMAIL=your_email@example.com
BBC_EMAIL=copy_email@example.com
PASS_EMAIL=your_password_here
```

⚠️ **Importante**: Para que o disparo de e-mails funcione corretamente, é necessário configurar um **provedor SMTP válido** (como Gmail, Outlook, Amazon SES, etc.).  
Caso contrário, o envio de OTP na rota AUTH não será realizado.

👉 Se deseja testar a aplicação **100% funcional**, incluindo envio real de e-mails, este projeto já foi implantado em nuvem AWS (Lambda) e a documentação interativa está disponível em:  
🔗 [Swagger Público](https://swagger-rodrigo-btg.s3.sa-east-1.amazonaws.com/index.html)

---

## 📖 Endpoints Principais

### **Autenticação**

- `POST /api/v1/btg/auth/register` → Criar novo usuário -> o email informado nessa rota será usado para disparar o token OTP no email.
- `POST /api/v1/btg/auth/login` → Realizar login e envia OTP no email cadastrado
- `POST /api/v1/btg/auth/validate-otp` → Validar OTP e obter JWT -> aqui é necessário passar a jwt gerado no login como Bearer Token nela estão informações que são utilizadas para validação.

### **Usuários**

- `GET /api/v1/btg/users/profile` → Obter perfil do usuário autenticado

### **OTP**

- `POST /api/v1/btg/otp/create` → Criar novo OTP
- `POST /api/v1/btg/otp/validate` → Validar OTP
- `GET /api/v1/btg/otp/status/{hash}` → Consultar status de OTP

### **Sistema**

- `GET /api/v1/btg/health` → Health check

---

## 🧪 Testes

```bash
# Instalar dependências
yarn

# Executar em desenvolvimento
yarn start:dev

# Rodar testes unitários
yarn test

# Rodar testes end-to-end
yarn test:e2e

# Verificar cobertura de testes
yarn test:cov
```

---

## ℹ️ Mais informações

Este projeto foi desenvolvido utilizando NestJS.
Na documentação oficial, o framework sugere a utilização de uma estrutura baseada em módulos tradicionais, sem a adoção explícita de Arquitetura Limpa ou Hexagonal.

👉 Você pode conferir essa implementação na branch:

- [Branch Arquitetura NestJS](https://github.com/Rodrigojuniorj/btg-otp/tree/core/feature/nestjs-folder-structure)

Já nas branches develop e main, o projeto foi estruturado seguindo os princípios da Arquitetura Limpa/Hexagonal, garantindo maior separação de responsabilidades, testabilidade e independência de frameworks.

---

## 🔮 Possíveis Melhorias & Próximos Passos

### Integração com múltiplos provedores de e-mail

Permitir configuração de fallback entre serviços (ex.: Amazon SES, SendGrid, Gmail) para garantir maior disponibilidade no envio de OTPs.

### Suporte a SMS e WhatsApp

Expandir os canais de envio de OTP, utilizando provedores como Twilio ou AWS SNS.

### Políticas avançadas de segurança

- Bloqueio temporário após tentativas inválidas consecutivas.
- Expiração configurável de OTP por tipo de operação.
- Possibilidade de “lembrar dispositivo confiável”.

### Cache distribuído

Uso de Redis para armazenar sessões de OTP de forma distribuída, otimizando a escalabilidade em ambientes com múltiplas instâncias.

### Observabilidade

- Métricas com Prometheus/Grafana.
- Logs estruturados em JSON.
- Integração com APM (ex.: Datadog, New Relic).

### Deploy multi-ambiente

Automatizar pipelines CI/CD para ambientes de _staging_, _homologação_ e _produção_.

### Gestão avançada de usuários

- Papéis e permissões (RBAC).
- Autenticação social (Google, GitHub, etc).

### Testes adicionais

- Testes de carga e stress para validar limites de OTP.
- Testes de segurança (fuzzing, injeção, brute force).

---

## 📚 Recursos e Referências

- [NestJS Documentation](https://docs.nestjs.com)
- [Docker Documentation](https://docs.docker.com)

---

## 📜 Licença

Este projeto é distribuído sob a licença **MIT**.
