import bodyParser from "body-parser";
import { Request, Response, Router } from "express";
import path from "path";
import { AccountController } from "../controllers/AccountController";
import { VerificationAccount } from "../controllers/VerificationsAccount";

const administrationRoute = Router();

administrationRoute.use(bodyParser.urlencoded({extended: true}));
administrationRoute.use(bodyParser.json());
administrationRoute.use(bodyParser.text({ type: 'text/json' }));

const __dirname = path.resolve();

const administrationRouteHTML = path.join(__dirname, '/src/views/admin-panel.ejs');

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

administrationRoute.get('/admin', new VerificationAccount().blockRegisterLoginPageIfLogged, (req: Request, res: Response) => {
    res.render(administrationRouteHTML, objectAlertEJS);
})

administrationRoute.post('/admin', new AccountController().adminPanelLogin, (req: Request, res: Response) => {
});

administrationRoute.get('/administration', (req: Request, res: Response) => {
    res.json({message: 'Administrador logado !'});
})

export default administrationRoute;