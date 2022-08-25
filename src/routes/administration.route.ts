import bodyParser from "body-parser";
import { Request, Response, Router } from "express";
import path from "path";
import { AccountController } from "../controllers/AccountController";

const administrationRoute = Router();

administrationRoute.use(bodyParser.urlencoded({extended: true}));
administrationRoute.use(bodyParser.json());
administrationRoute.use(bodyParser.text({ type: 'text/json' }));

const __dirname = path.resolve();

const administrationRouteHTML = path.join(__dirname, '/src/views/admin-panel.ejs');

administrationRoute.get('/admin', (req: Request, res: Response) => {
    res.render(administrationRouteHTML);
})

administrationRoute.post('/admin', new AccountController().adminPanelLogin, (req: Request, res: Response) => {
})

export default administrationRoute;