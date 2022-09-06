import { Request, Response, Router } from "express";
import path from "path";
import { VerificationAccount } from "../controllers/VerificationsAccount";

const dashboardRoute = Router();

const __dirname = path.resolve();

const dashboardEJS = path.join(__dirname, 'src/views/dashboard-layouts/dashboard.ejs');

dashboardRoute.get('/dashboard', new VerificationAccount().checkIfUserAreLogged, (req: Request, res: Response) => {
    res.render(dashboardEJS);
});

dashboardRoute.get('/myposts', new VerificationAccount().checkIfUserAreLogged, (req: Request, res: Response) => {
    
})

export default dashboardRoute;