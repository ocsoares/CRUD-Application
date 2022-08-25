import path from "path";
import { Request, Response, Router } from "express";
import { AccountController } from '../controllers/AccountController'

const registerLoginRoute = Router();

const __dirname = path.resolve();

const objectEJS = {
    invalidData: ''
}

const registerLoginRouteHTML = path.join(__dirname, '/src/views/signup-login.ejs');

registerLoginRoute.get('/account', (req: Request, res: Response) => {
    req.flash('success', 'teste boy...');
    res.render(registerLoginRouteHTML, objectEJS);
                                //, {teste: 'FODASE KKK'} << Exemplo q pode ser usado no .ejs !! <<
})

registerLoginRoute.post('/account', new AccountController().registerOrLoginAccount, (req: Request, res: Response) => {
    res.redirect('/account');
})

export default registerLoginRoute;