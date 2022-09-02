import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import { AppDataSource } from './config/database'
import registerLoginRoute from './routes/register-login.route'
import administrationRoute from './routes/administration.route'
import dashboardRoute from './routes/dashboard.route'
import cors from 'cors'
import session from 'cookie-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash'

// Alterei o includes em tsconfig.json de "src/*.ts" para apenas "src/" Porque NÃO estava Transpilando ALGUNS arquivos de .ts para .js no dist !! <<

// Instruções para o connect-flash:
// Fazer um Middleware no Código Principal com as Mensagens a serem usadas (NÃO esquecer do next) com req.locals.nome = req.flash('nome');
// >IMPORTANTE<: Não esquecer de colocar o Código EJS no EJS da Página a ser RENDERIZADA ou REDIRECIONADA !! <<
// Usar no EJS <% if(NOME != '') { %>... (APENAS !=) !! <<
// Para as Mensagens FLASH no EJS, usar <%- NOME %> com - no Começo !! <<
// EVITAR usar console.log com as Mensagens FLASH, porque BUGA !! <<
// NÃO usar Nome de Variável JÁ EXISTENTE (mesmo se NÃO estiver usando) para Mensagens FLASH, porque BUGA !!

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
        httpOnly: true,
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

    const apenastesteEJS = path.join(__dirname, '/src/views/apenasteste.ejs')

    server.use((req: Request, res: Response, next: NextFunction) => {
        res.locals.invalidTokenFlash = req.flash('invalidTokenFlash');
        res.locals.internalServerErrorFlash = req.flash("internalServerErrorFlash");
        res.locals.passwordAlreadyChangedFlash = req.flash('passwordAlreadyChangedFlash'); 
        res.locals.successChangeForgotPasswordFlash = req.flash('successChangeForgotPasswordFlash');
        res.locals.permissionDeniedFlash = req.flash('permissionDeniedFlash');
        res.locals.successLogoutFlash = req.flash('successLogoutFlash');
        next();
      });

    server.get('/teste', (req: Request, res: Response) => {
                // FUNCIONO ! 
        // req.flash('teste', 'arrozpreto');
        // res.redirect('/testemsg');

        let arroz = 3
        if(arroz === 3){
            req.flash('passwordAlreadyChangedFlash', 'TESTEEEEEEEEEEEEEEEEEEE'); 
            res.redirect('/testemsg');
        }

        else{
            req.flash('testedois', 'testedois PORRAA KKK')
            res.redirect('/testemsg');
        }
    })

    server.get('/testemsg', (req: Request, res: Response) => {
            // FUNCIONO !! 
        // res.send(req.flash('teste'))

        res.render(apenastesteEJS);
    })

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