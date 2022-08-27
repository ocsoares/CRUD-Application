import path from "path";
import { Request, Response, Router } from "express";
import { AccountController } from '../controllers/AccountController'
import { VerificationAccount } from "../controllers/VerificationsAccount";
import cookieParser from "cookie-parser";
import session from 'cookie-session'

const registerLoginRoute = Router();

registerLoginRoute.use(session({
    name: 'session_app',
    secret: process.env.COOKIE_SECRET,
    keys: [process.env.COOKIE_SECRET as string],
    sameSite: 'strict',
    secure: process.env.COOKIE_SECRET === 'production' ? true : false,
    httpOnly: true
}));

registerLoginRoute.use(cookieParser()); // Sem isso o req.cookies tb funciona... ??

const __dirname = path.resolve();

    // Para funcionar aqui nas Rotas, tenho que colocar esse Objeto AQUI e no Controller !! <<
    //  OBS: Também tenho que passar esse Objeto no .render !! <<
const objectAlertEJS = {
    invalidData: undefined,
    userExists: undefined,
    emailExists: undefined,
    invalidEmail: undefined,
    successRegister: undefined,
    differentPasswords: undefined,
    internalServerError: undefined,
    errorLogin: undefined,
    successLogin: undefined
};

const registerLoginRouteHTML = path.join(__dirname, '/src/views/signup-login.ejs');

registerLoginRoute.get('/account', new VerificationAccount().blockRegisterLoginPageIfLogged, (req: Request, res: Response) => {
    console.log('sdjinfiso')
    res.render(registerLoginRouteHTML, objectAlertEJS);
                                //, {teste: 'FODASE KKK'} << Exemplo q pode ser usado no .ejs !! <<
})

registerLoginRoute.post('/account', new AccountController().registerOrLoginAccount, (req: Request, res: Response) => {
    console.log('COOKIE:', req.cookies);
    console.log('SignedCookies kk:', req.signedCookies);
})

export default registerLoginRoute;