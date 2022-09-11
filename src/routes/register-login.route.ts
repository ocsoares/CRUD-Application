import path from "path";
import { Request, Response, Router } from "express";
import { AccountController } from '../controllers/AccountController'
import { VerificationAccount } from "../controllers/VerificationsAccount";
import cookieParser from "cookie-parser";
import { sendNodemailerToResetPass } from "../scripts/nodemailer.script";

const registerLoginRoute = Router();

registerLoginRoute.use(cookieParser()); // Sem isso o req.cookies tb funciona... ??

const __dirname = path.resolve();

const registerLoginRouteEJS = path.join(__dirname, '/src/views/signup-login.ejs');
const forgotPasswordEJS = path.join(__dirname, '/src/views/forgotpassword.ejs');
const changeForgotPasswordEJS = path.join(__dirname, '/src/views/changeforgotpassword.ejs');

registerLoginRoute.get('/account', new VerificationAccount().blockRegisterLoginPageIfLogged, (req: Request, res: Response) => {
    res.render(registerLoginRouteEJS, res.locals.alerts);
})

registerLoginRoute.post('/account', new AccountController().registerOrLoginAccount, (req: Request, res: Response) => {
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