import bodyParser from "body-parser";
import { Request, Response, Router } from "express";
import path from "path";
import session from 'cookie-session'
import { AccountController } from "../controllers/AccountController";
import { VerificationAccount } from "../controllers/VerificationsAccount";
import { AccountRepository } from "../repositories/AccountRepository";
import { AdminController } from "../controllers/AdminController";

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
const administrationDashboardEJS = path.join(__dirname, '/src/views/admin-layouts/dashboard.ejs');
const createANewUserEJS = path.join(__dirname, 'src/views/admin-layouts/create-new-user.ejs');
const editUserEJS = path.join(__dirname, 'src/views/admin-layouts/edit-user.ejs');

administrationRoute.get('/admin', new VerificationAccount().blockAdminPageIfLogged, (req: Request, res: Response) => {
    res.render(administrationRouteHTML, res.locals.alerts);
})

administrationRoute.post('/admin', new AccountController().adminPanelLogin, (req: Request, res: Response) => {
});

administrationRoute.get('/administration', new VerificationAccount().checkIfAdminAreLogged, async (req: Request, res: Response) => {
    const databaseUsers = await AccountRepository.query('SELECT * FROM accounts;'); // Para mostrar no EJS os Usuários no Banco de Dados !! <<
    res.render(administrationDashboardEJS, {databaseUsers});
})

administrationRoute.post('/administration', new VerificationAccount().checkIfAdminAreLogged, new AdminController().searchUser, (req: Request, res: Response) => {
})

administrationRoute.get('/createuser', new VerificationAccount().checkIfAdminAreLogged, (req: Request, res: Response) => {
    res.render(createANewUserEJS);
})

administrationRoute.post('/createuser', new VerificationAccount().checkIfAdminAreLogged, new AdminController().createANewUser, (req: Request, res: Response) => {
})

administrationRoute.get('/edituser/:idAccount', new VerificationAccount().checkIfAdminAreLogged, async (req: Request, res: Response) => {
    const { idAccount } = req.params;

    const searchUserByID = await AccountRepository.findOneBy({id: Number(idAccount)});

    res.render(editUserEJS, {searchUserByID});
})

administrationRoute.post('/edituser/:idAccount', new VerificationAccount().checkIfAdminAreLogged, new AdminController().editUser, (req: Request, res: Response) => {
})

administrationRoute.get('/logout', new VerificationAccount().checkIfAdminAreLogged, (req: Request, res: Response) => {
    res.json({message: 'Deslogado !'});
})

export default administrationRoute;