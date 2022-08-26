import { Request, Response, Router } from "express";

const dashboardRoute = Router();

dashboardRoute.get('/dashboard', (req: Request, res: Response) => {
    res.json({message: 'LOGADO !'});
})

export default dashboardRoute;