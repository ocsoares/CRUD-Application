import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import { AppDataSource } from './database'
import registerLoginRoute from './routes/register-login.route'
import administrationRoute from './routes/administration.route'
import dashboardRoute from './routes/dashboard.route'
import cors from 'cors'
import session from 'cookie-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash'

// Alterei o includes em tsconfig.json de "src/*.ts" para apenas "src/" Porque NÃO estava Transpilando ALGUNS arquivos de .ts para .js no dist !! <<

AppDataSource.initialize().then(() => {
    const server = express();

    const localHost = 'http://localhost';
    const port = 5000;
    const __dirname = path.resolve();

    server.set('trust proxy', 1);
    server.set('view engine', 'ejs');

    server.use(cookieParser(process.env.COOKIE_SECRET));

    server.use(session({
        name: 'session_app' || 'session_admin',
        secret: process.env.COOKIE_SECRET,
        keys: [process.env.COOKIE_SECRET as string],
        sameSite: 'strict',
        secure: process.env.COOKIE_SECRET === 'production' ? true : false,
        httpOnly: true
    }));

    server.use(connectFlash());

        // Middleware de Alertas para usar em QUALQUER Rota !! <<
    server.use((req: Request, res: Response, next: NextFunction) => {
        res.locals.alerts = {
        teste: req.flash(), // Colocar o NOME do req.flash("nome") Aqui como UNDEFINED, e no Controller DEFINIR o Nome !! <<
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

    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(bodyParser.json());
    server.use(bodyParser.text({ type: 'text/json' }));

    server.use(cors());
    server.use(express.static(__dirname + '/src/views'));
    server.use(express.static(__dirname + '/src/public'));
    server.use(express.static(__dirname + '/dist'));

    server.use(registerLoginRoute);
    server.use(dashboardRoute);
    server.use(administrationRoute);
    

    return server.listen(process.env.PORT || port, () => {
        if (process.env.NODE_ENV === 'production') {
            console.log('Servidor rodando remotamente no Heroku !');
        }

        else {
            console.log(`Servidor rodando localmente em ${localHost}:${port}`);
        }
    })
})