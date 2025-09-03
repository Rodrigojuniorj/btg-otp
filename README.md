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

## 📚 Recursos e Referências

- [NestJS Documentation](https://docs.nestjs.com)
- [Docker Documentation](https://docs.docker.com)

---

## 📜 Licença

Este projeto é distribuído sob a licença **MIT**.
