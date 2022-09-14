import 'dotenv/config'
import 'reflect-metadata' // Typescript pede para Importar para Funcionar o TypeORM !! <<
import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import { AppDataSource } from './config/database'
import registerLoginRoute from './routes/register-login.route'
import administrationRoute from './routes/administration.route'
import dashboardRoute from './routes/dashboard.route'
import cors from 'cors'
// import session from 'cookie-session'
import session from 'express-session'
// import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash'
import { TypeormStore } from 'connect-typeorm/out'
import { TypeormStoreRepository } from './repositories/TypeormStore'

// Alterei o includes em tsconfig.json de "src/*.ts" para apenas "src/" Porque NÃO estava Transpilando ALGUNS arquivos de .ts para .js no dist !! <<

// Instruções para o connect-flash:
// Fazer um Middleware no Código Principal com as Mensagens a serem usadas (NÃO esquecer do next) com req.locals.nome = req.flash('nome');
// >IMPORTANTE<: Não esquecer de colocar o Código EJS no EJS da Página a ser RENDERIZADA ou REDIRECIONADA !! <<
// Usar no EJS <% if(NOME != '') { %>... (APENAS !=) !! <<
// Para as Mensagens FLASH no EJS, usar <%- NOME %> com - no Começo !! <<
// EVITAR usar console.log com as Mensagens FLASH, porque BUGA !! <<
// NÃO usar Nome de Variável JÁ EXISTENTE (mesmo se NÃO estiver usando) para Mensagens FLASH, porque BUGA !!

// Estava dando erro de 'Unhandled promise rejection' no Deploy porque a Inicialização do Banco de Dados (AQUI) estava sem o .catch no FINAL !! <<

const __dirname = path.resolve();

const notFoundEJS = path.join(__dirname, '/src/views/not-found.ejs');

AppDataSource.initialize().then(() => {
    const server = express();

    const localHost = 'http://localhost';
    const port = 5000;
    const __dirname = path.resolve();

    server.set('trust proxy', 1);
    server.set('view engine', 'ejs');

    // server.use(cookieParser(process.env.COOKIE_SECRET));

    server.use(session({
        name: 'session_app' || 'session_admin',
        secret: process.env.COOKIE_SECRET as string,
        saveUninitialized: true,
        resave: true,
        store: new TypeormStore({
            cleanupLimit: 2,
            ttl: 43200, // 12h
            onError: (s: TypeormStore, e: Error) => console.log({
                error: e,
                algoS: s
            })
        }).connect(TypeormStoreRepository),
        cookie: {
            secure: process.env.COOKIE_SECRET === 'production' ? true : false,
            httpOnly: true
        }
        // name: 'session_app' || 'session_admin',
        // secret: process.env.COOKIE_SECRET,
        // keys: [process.env.COOKIE_SECRET as string],
        // sameSite: 'strict',
        // secure: process.env.COOKIE_SECRET === 'production' ? true : false,
        // httpOnly: true,
    }));

    server.use(connectFlash());

    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(bodyParser.json());
    server.use(bodyParser.text({ type: 'text/json' }));

    server.use(cors());
    server.use(express.static(__dirname + '/src/views'));
    server.use(express.static(__dirname + '/src/public'));
    server.use(express.static(__dirname + '/dist'));

        // Middleware de Alertas para usar em QUALQUER Rota !! <<
    server.use((req: Request, res: Response, next: NextFunction) => {
        res.locals.alerts = {
        invalidData: undefined,
        userExists: undefined,
        emailExists: undefined,
        invalidEmail: undefined,
        successRegister: undefined,
        differentPasswords: undefined,
        internalServerError: undefined,
        errorLogin: undefined,
        successLogin: undefined,
        errorForgotPassword: undefined,
        successToSendEmail: undefined,
        errorChangeForgotPassword: undefined,
        successChangeForgotPassword: undefined,
        passwordAlreadyChanged: undefined,
        invalidToken: undefined
        }
        
        next();
    })

        // Middleware de Flash Messages !! <<
    server.use((req: Request, res: Response, next: NextFunction) => {
        res.locals.errorFlash = req.flash('errorFlash');
        res.locals.successFlash = req.flash("successFlash");
        next();
      });

    server.use(registerLoginRoute);
    server.use(dashboardRoute);
    server.use(administrationRoute);

        // Evita que acesse o URL inicial porque não tem nada (Melhor pro Deploy, se não ia ter que adivinhar as Rotas) !! <<
    server.get('/', (req: Request, res: Response) => {
        res.redirect('/account');
    })

      // Usado para Rotas NÃO EXISTENTES (obviamente tem que ser por Último, DEPOIS de Todas as Rotas Usadas) !! <<
    server.get('*', (req: Request, res: Response) => {
        res.render(notFoundEJS);
    })
    
    return server.listen(process.env.PORT || port, () => {
        if (process.env.NODE_ENV === 'production') {
            console.log('Servidor rodando remotamente no Render !');
        }

        else {
            console.log(`Servidor rodando localmente em ${localHost}:${port}`);
        }
    })
}).catch((error) => console.log(error));