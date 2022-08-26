import path from "path";
import { Request, Response, Router } from "express";
import { AccountController } from '../controllers/AccountController'

const registerLoginRoute = Router();

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
}

const registerLoginRouteHTML = path.join(__dirname, '/src/views/signup-login.ejs');

registerLoginRoute.get('/account', (req: Request, res: Response) => {
    req.flash('success', 'teste boy...');
    res.render(registerLoginRouteHTML, objectAlertEJS);
                                //, {teste: 'FODASE KKK'} << Exemplo q pode ser usado no .ejs !! <<
})

registerLoginRoute.post('/account', new AccountController().registerOrLoginAccount, (req: Request, res: Response) => {
    res.redirect('/account');
})

export default registerLoginRoute;