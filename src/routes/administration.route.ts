import bodyParser from "body-parser";
import { Request, Response, Router } from "express";
import path from "path";
// import session from 'cookie-session'
import session from 'express-session'
import { AccountController } from "../controllers/AccountController";
import { VerificationAccount } from "../controllers/VerificationsAccount";
import { AccountRepository } from "../repositories/AccountRepository";
import { AdminController } from "../controllers/AdminController";
import { LogsAdminRepository } from "../repositories/LogsAdmin";
import { TypeormStore } from "connect-typeorm/out/app/TypeormStore/TypeormStore";
import { TypeormStoreRepository } from "../repositories/TypeormStore";

const administrationRoute = Router();

administrationRoute.use(session({
    name: 'session_admin',
        secret: process.env.COOKIE_SECRET as string,
        saveUninitialized: true,
        resave: true,
        store: new TypeormStore({
            cleanupLimit: 2,
            ttl: 43200, // 12h
            onError: (s: TypeormStore, e: Error) => console.log({
                error: e,
                algoS: s
            })
        }).connect(TypeormStoreRepository),
        cookie: {
            secure: process.env.COOKIE_SECRET === 'production' ? true : false,
            httpOnly: true
        }
}));

// administrationRoute.use(session({
//     name: 'session_app',
//     secret: process.env.COOKIE_SECRET,
//     keys: [process.env.COOKIE_SECRET as string],
//     sameSite: 'strict',
//     secure: process.env.COOKIE_SECRET === 'production' ? true : false,
//     httpOnly: true
// }));

administrationRoute.use(bodyParser.urlencoded({extended: true}));
administrationRoute.use(bodyParser.json());
administrationRoute.use(bodyParser.text({ type: 'text/json' }));

const __dirname = path.resolve();

const administrationRouteHTML = path.join(__dirname, '/src/views/admin-panel.ejs');
const administrationDashboardEJS = path.join(__dirname, '/src/views/admin-layouts/dashboard.ejs');
const createANewUserEJS = path.join(__dirname, '/src/views/admin-layouts/create-new-user.ejs');
const editUserEJS = path.join(__dirname, '/src/views/admin-layouts/edit-user.ejs');
const deleteUserEJS = path.join(__dirname, '/src/views/admin-layouts/delete-user.ejs');
const viewUserEJS = path.join(__dirname, '/src/views/admin-layouts/view-user.ejs');

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

administrationRoute.get('/administration/createuser', new VerificationAccount().checkIfAdminAreLogged, (req: Request, res: Response) => {
    res.render(createANewUserEJS);
})

administrationRoute.post('/administration/createuser', new VerificationAccount().checkIfAdminAreLogged, new AdminController().createANewUser, (req: Request, res: Response) => {
})

    // Nesse caso, NÃO precisa de POST, porque é apenas para VER !! <<
administrationRoute.get('/administration/viewuser/:idAccount', new VerificationAccount().checkIfAdminAreLogged, async (req: Request, res: Response) => {
    const { idAccount } = req.params;

        // Coloquei em um Try Catch para NÃO cair o App se NÃO encontrar o ID no Banco de Dados !! <<
    try{
        const searchUserByID = await AccountRepository.findOneBy({id: Number(idAccount)});
        const searchCreateAccountLog = await LogsAdminRepository.findOneBy({username: searchUserByID?.username, id_real_account: null as unknown as undefined});
        const searchLogsAdminByID = await LogsAdminRepository.findBy({id_real_account: Number(idAccount)});

        console.log('searchCreate...:', searchCreateAccountLog);
        console.log('searchLogsAdmin...:', searchLogsAdminByID);

        if(!searchUserByID){ // Precisa dessa Verificação aqui também para NÃO mostrar o Erro do HTML !! <<
            req.flash('errorFlash', 'ID do usuário inválido !');
            return res.redirect('/administration');
        }

        return res.render(viewUserEJS, { searchUserByID, searchLogsAdminByID, searchCreateAccountLog });
    }
    catch(error){
        console.log(error);
        req.flash('errorFlash', 'ID do usuário inválido !');
        return res.redirect('/administration');
    }
})

administrationRoute.get('/administration/edituser/:idAccount', new VerificationAccount().checkIfAdminAreLogged, async (req: Request, res: Response) => {
    const { idAccount } = req.params;

    try{
        const searchUserByID = await AccountRepository.findOneBy({id: Number(idAccount)});

        if(!searchUserByID){
            req.flash('errorFlash', 'ID do usuário inválido !');
            return res.redirect('/administration');
        }

        if(searchUserByID.type === 'admin'){
            req.flash('errorFlash', 'Não é possível editar um administrador !');
            return res.redirect('/administration');
        }

        return res.render(editUserEJS, {searchUserByID});
    }
    catch(error){
        req.flash('errorFlash', 'ID do usuário inválido !');
        return res.redirect('/administration');
    }
})

administrationRoute.post('/administration/edituser/:idAccount', new VerificationAccount().checkIfAdminAreLogged, new AdminController().editUser, (req: Request, res: Response) => {
})

administrationRoute.get('/administration/deleteuser/:idAccount', new VerificationAccount().checkIfAdminAreLogged, async (req: Request, res: Response) => {
    const { idAccount } = req.params;

    try {
        const searchUserByID = await AccountRepository.findOneBy({ id: Number(idAccount) });

        if(searchUserByID?.type === 'admin'){
            req.flash('errorFlash', 'Não é possível deletar um administrador !');
            return res.redirect('/administration');
        }

        if (!searchUserByID) {
            req.flash('errorFlash', 'ID do usuário inválido !');
            return res.redirect('/administration');
        }

        return res.render(deleteUserEJS, { searchUserByID });
    }
    catch (error) {
        req.flash('errorFlash', 'ID do usuário inválido !');
        return res.redirect('/administration');
    }
})

administrationRoute.post('/administration/deleteuser/:idAccount', new VerificationAccount().checkIfAdminAreLogged, new AdminController().deleteUser, (req: Request, res: Response) => {
})

administrationRoute.get('/logout', new VerificationAccount().checkIfAdminAreLogged, (req: Request, res: Response) => {
    res.json({message: 'Deslogado !'});
})

export default administrationRoute;