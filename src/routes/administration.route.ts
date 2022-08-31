import bodyParser from "body-parser";
import { Request, Response, Router } from "express";
import path from "path";
import session from 'cookie-session'
import { AccountController } from "../controllers/AccountController";
import { VerificationAccount } from "../controllers/VerificationsAccount";

const administrationRoute = Router();

administrationRoute.use(session({
    name: 'session_app',
    secret: process.env.COOKIE_SECRET,
    keys: [process.env.COOKIE_SECRET as string],
    sameSite: 'strict',
    secure: process.env.COOKIE_SECRET === 'production' ? true : false,
    httpOnly: true
}));

administrationRoute.use(bodyParser.urlencoded({extended: true}));
administrationRoute.use(bodyParser.json());
administrationRoute.use(bodyParser.text({ type: 'text/json' }));

const __dirname = path.resolve();

const administrationRouteHTML = path.join(__dirname, '/src/views/admin-panel.ejs');

administrationRoute.get('/admin', new VerificationAccount().blockAdminPageIfLogged, (req: Request, res: Response) => {
    res.render(administrationRouteHTML, res.locals.alerts);
})

administrationRoute.post('/admin', new AccountController().adminPanelLogin, (req: Request, res: Response) => {
});

administrationRoute.get('/administration', new VerificationAccount().checkIfAdminAreLogged, (req: Request, res: Response) => {
    res.json({message: 'Administrador logado !'});
})

administrationRoute.get('/logout', new VerificationAccount().checkIfAdminAreLogged, (req: Request, res: Response) => {
    res.json({message: 'Deslogado !'});
})

export default administrationRoute;