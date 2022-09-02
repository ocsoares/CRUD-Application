import path from "path";
import { Request, Response, Router } from "express";
import { AccountController } from '../controllers/AccountController'
import { VerificationAccount } from "../controllers/VerificationsAccount";
import cookieParser from "cookie-parser";
import { sendNodemailerToResetPass } from "../scripts/nodemailer.script";

const registerLoginRoute = Router();

// registerLoginRoute.use(session({
//     name: 'session_app' || 'session_admin',
//     secret: process.env.COOKIE_SECRET,
//     keys: [process.env.COOKIE_SECRET as string],
//     sameSite: 'strict',
//     secure: process.env.COOKIE_SECRET === 'production' ? true : false,
//     httpOnly: true
// }));

registerLoginRoute.use(cookieParser()); // Sem isso o req.cookies tb funciona... ??

const __dirname = path.resolve();

    // Para funcionar aqui nas Rotas, tenho que colocar esse Objeto AQUI e no Controller !! <<
    //  OBS: Também tenho que passar esse Objeto no .render !! <<
    // >> Tentar colocar isso como MIDDLEWARE GLOBAL em uma req. ou req.locals.  !! <<
// let objectAlertEJS: any = {
//     teste: '', // Colocar o NOME do req.flash("nome") Aqui como UNDEFINED, e no Controller DEFINIR o Nome !! <<
//     invalidData: undefined,
//     userExists: undefined,
//     emailExists: undefined,
//     invalidEmail: undefined,
//     successRegister: undefined,
//     differentPasswords: undefined,
//     internalServerError: undefined,
//     errorLogin: undefined,
//     successLogin: undefined,
//     errorForgotPassword: undefined,
//     successToSendEmail: undefined,
//     errorChangeForgotPassword: undefined,
//     successChangeForgotPassword: undefined,
//     passwordAlreadyChanged: undefined,
//     invalidToken: undefined
// };

const registerLoginRouteEJS = path.join(__dirname, '/src/views/signup-login.ejs');
const forgotPasswordEJS = path.join(__dirname, '/src/views/forgotpassword.ejs');
const changeForgotPasswordEJS = path.join(__dirname, '/src/views/changeforgotpassword.ejs');

registerLoginRoute.get('/account', new VerificationAccount().blockRegisterLoginPageIfLogged, (req: Request, res: Response) => {
    res.render(registerLoginRouteEJS, res.locals.alerts);
                                //, {teste: 'FODASE KKK'} << Exemplo q pode ser usado no .ejs !! <<
})

registerLoginRoute.post('/account', new AccountController().registerOrLoginAccount, (req: Request, res: Response) => {
    console.log('COOKIE:', req.cookies);
    console.log('SignedCookies kk:', req.signedCookies);
})

registerLoginRoute.get('/logout', new VerificationAccount().checkIfUserAreLogged,
new AccountController().logoutAccount, (req: Request, res: Response) => {
    res.json({message: 'Deslogado !'});
})

registerLoginRoute.get('/forgotpassword', new VerificationAccount().blockRegisterLoginPageIfLogged, (req: Request, res: Response) => {
    res.render(forgotPasswordEJS, res.locals.alerts);
})

registerLoginRoute.post('/forgotpassword', new VerificationAccount().blockRegisterLoginPageIfLogged,
new AccountController().forgotPassword, sendNodemailerToResetPass(), (req: Request, res: Response) => {
    // Fazer um Verification() que retorna um Render para Colocar mensagem de ERRO ou Sucesso !! <<
})

    // FAZER um Middleware para Verificar se o JWT é válido !! << PENSAR se tem que por no POST também, ACHO que não...
registerLoginRoute.get('/changepassword/:JWT', new VerificationAccount().blockRegisterLoginPageIfLogged, 
new AccountController().checkJWTParamsChangePassword, (req: Request, res: Response) => {
    res.render(changeForgotPasswordEJS, res.locals.alerts);
})

registerLoginRoute.post('/changepassword/:JWT', new VerificationAccount().blockRegisterLoginPageIfLogged, 
new AccountController().changeForgotPassword, (req: Request, res: Response) => {
})

export default registerLoginRoute;