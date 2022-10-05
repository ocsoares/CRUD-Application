# **CRUD** completo em um Blog de postagem
[![NPM](https://img.shields.io/npm/l/react)](https://github.com/neliocursos/exemplo-readme/blob/main/LICENSE) 

# Autor

Cauã Soares

https://www.linkedin.com/in/ocauasoares/

# Sobre o projeto

## Hospedado/Deploy no Render:
https://crud-web-blog.onrender.com/ <br>
**ATENÇÃO:** Caso o Deploy não tenha acesso em um determinado período de tempo, ele ficará offline até que tenha algum acesso. Então, caso o link demore a carregar, é completamente normal e basta esperar para utilizar o site.

### Rota para **administração**:
https://crud-web-blog.onrender.com/admin <br>
**Conta** de administrador para testes: <br>
Email: testeadmin@gmail.com <br>
Senha: testeadmin12

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
![Registro](https://raw.githubusercontent.com/ocsoares/CRUD-Web-Blog/master/assets/registro.jpg)

## Login
![Login](https://raw.githubusercontent.com/ocsoares/CRUD-Web-Blog/master/assets/login.jpg)

## Esqueci a senha
![Esqueci a senha](https://raw.githubusercontent.com/ocsoares/CRUD-Web-Blog/master/assets/esqueci-senha.jpg)

## Exemplo de mensagem
![Exemplo de mensagem](https://raw.githubusercontent.com/ocsoares/CRUD-Web-Blog/master/assets/exemplo-mensagens.jpg)

## Dashboard e Todas as postagens publicadas
![Dashboard e Todas as postagens publicadas](https://raw.githubusercontent.com/ocsoares/CRUD-Web-Blog/master/assets/todas-as-postagens.jpg)

## Minhas postagens (sem posts publicados)
![Minhas postagens (sem posts publicados)](https://raw.githubusercontent.com/ocsoares/CRUD-Web-Blog/master/assets/sem-posts.jpg)

## Minhas postagens (com posts publicados)
![Minhas postagens (com posts publicados)](https://raw.githubusercontent.com/ocsoares/CRUD-Web-Blog/master/assets/minhas-postagens.jpg)

## Criando postagem
![Criando postagem](https://raw.githubusercontent.com/ocsoares/CRUD-Web-Blog/master/assets/criando-posts.jpg)

## Visualizando postagem
![Visualizando postagem](https://raw.githubusercontent.com/ocsoares/CRUD-Web-Blog/master/assets/visualizar-postagem.jpg)

## Excluindo postagem
![Pergunta excluir](https://raw.githubusercontent.com/ocsoares/CRUD-Web-Blog/master/assets/pergunta-excluir.jpg)
![Excluido](https://raw.githubusercontent.com/ocsoares/CRUD-Web-Blog/master/assets/excluido.jpg)

## Login administrador
![Login administrador](https://raw.githubusercontent.com/ocsoares/CRUD-Web-Blog/master/assets/admin-panel.jpg)

## Dashboard administrador
![Dashboard administrador](https://raw.githubusercontent.com/ocsoares/CRUD-Web-Blog/master/assets/administration.jpg)

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
