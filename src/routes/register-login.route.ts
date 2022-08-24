import session from 'cookie-session'
import path from "path";
import bodyParser from 'body-parser';
import { Request, Response, Router } from "express";
import { AccountController } from '../controllers/AccountController'

const registerLoginRoute = Router();

const __dirname = path.resolve()

const registerLoginRouteHTML = path.join(__dirname, '/src/public/html/signup-login.html');

registerLoginRoute.use(bodyParser.urlencoded({extended: true}));
registerLoginRoute.use(bodyParser.json());
registerLoginRoute.use(bodyParser.text({ type: 'text/json' }));

registerLoginRoute.get('/account', (req: Request, res: Response) => {
    console.log('Você está na página de registro !');
    res.sendFile(registerLoginRouteHTML);
})

registerLoginRoute.post('/account', new AccountController().registerOrLoginAccount, (req: Request, res: Response) => {
})

export default registerLoginRoute;