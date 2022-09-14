# Sistema de Cadastro/Login (com API de CEP e enviar email no registro)
[![NPM](https://img.shields.io/npm/l/react)](https://github.com/neliocursos/exemplo-readme/blob/main/LICENSE) 

# Sobre o projeto

## Hospedado no Heroku:<br>
https://sistema-login-api-cep-e-email.herokuapp.com/register <br>
https://sistema-login-api-cep-e-email.herokuapp.com/login

O projeto consiste em um Blog para postagem de artigos, um sistema de cadastro/login, 

## Registro
![Registro](https://raw.githubusercontent.com/ocsoares/Sistema-de-login-API-de-CEP-e-Enviar-email-DeployHeroku/master/assets/registro.jpg)

## Login
![Login](https://raw.githubusercontent.com/ocsoares/Sistema-de-login-API-de-CEP-e-Enviar-email-DeployHeroku/master/assets/login.jpg)

## Dashboard
![Dashboard](https://raw.githubusercontent.com/ocsoares/Sistema-de-login-API-de-CEP-e-Enviar-email-DeployHeroku/master/assets/dashboard.jpg)

# Tecnologias e Bibliotecas utilizadas
## Back end
- Javascript
- Typescript
- Nodejs
- TypeORM ( Postgresql )
- Babel
- Browserify
- Axios
- Redis
- JWT
- Nodemailer
## Front end
- HTML
- CSS
- Javascript
# Como executar o projeto **Localmente**

Pré-requisitos: Javascript/Typescript, NodeJS

```bash
# clonar o repositório
git clone https://github.com/ocsoares/Sistema-de-login-API-de-CEP-e-Enviar-email-DeployHeroku

# instalar as bibliotecas
npm install

# configurar o banco de dados (Postgresql) com as suas credenciais
cd src
configurar o arquivo database.ts

# configurar o Redis com as suas credenciais
cd src
configurar o arquivo redisConfig.ts

# após configurado, transformar para .js
npm run tscdir

# executar o projeto
npm run start
```

# Autor

Cauã Soares

https://www.linkedin.com/in/ocauasoares/