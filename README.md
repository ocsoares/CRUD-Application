# **CRUD** completo em um Blog de postagem
[![NPM](https://img.shields.io/npm/l/react)](https://github.com/neliocursos/exemplo-readme/blob/main/LICENSE) 

# Autor

Cauã Soares

https://www.linkedin.com/in/ocauasoares/

# Sobre o projeto

## Hospedado no Render:
https://crud-web-blog.onrender.com/ <br>

O projeto consiste em um **CRUD** completo em um Blog, com **cadastro**/**login**,  **autenticação** do login, proteção das rotas **apenas** para usuários **logados**,  sistema de postagens, um sistema exclusivo para **administradores** e uma funcionalidade para **resetar** a **senha** se estiver esquecido.

## Características e funcionalidades do projeto:
- Sistema de cadastro/login, com verificação no banco dados para não criar contas já existentes.

- Rotas protegidas com um middleware de autenticação (com checagem no **JSON Web Token** fornecido no login).
- Funcionalidade de logout (armazena o **JWT** em uma **blacklist** no **Redis** para não permitir esse token ser usado novamente).
- Mensagens de sucesso ou erro.
- Rotas **não** existentes retornaram uma página com erro 404.
- Sistema de **postagens** para usuários **logados**, com opção de **buscar**/**ver**/**criar**/**deletar** posts.
- Sistema e rota exclusiva para **administradores**, que podem **ver**/**criar**/**editar** e **excluir** usuários, com os **logs** de suas ações sendo **registradas** na conta.
- Funcionalidade de **resetar** a **senha** da conta caso tenha esquecido, enviando por **email** um **token** que permitirá acessar a **rota** para criar uma nova senha. Esse token se expira em **15 minutos** e, após alterar a senha, **não** será permitido alterar novamente por **1 hora**.

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
- Express
- TypeORM ( Postgresql )
- Redis
- JWT
- Nodemailer
- connect-flash
- uuid
## Front end
- HTML (EJS)
- CSS
- Javascript
- Sweet Alert
# Como executar o projeto **Localmente**

Pré-requisitos: Javascript/Typescript, NodeJS, Express

```bash
# clonar o repositório
git clone https://github.com/ocsoares/CRUD-Web-Blog

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