import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken' 
import path from "path";
import { AccountRepository } from "../repositories/AccountRepository";

const __dirname = path.resolve();

const administrationRouteHTML = path.join(__dirname, '/src/views/admin-panel.ejs');

// Pagar um Método para Logout para cada Tipo de User, e depois Procurar algum HTML para eles !! <<

// Fazer um Sistema de ALTERAR a Senha !! <<

// Implementar Redis !! <<

export class VerificationAccount{
    async checkIfUserAreLogged(req: Request, res: Response, next: NextFunction){ // Verificar se é user ou admin !!
        const JWTCookie = req.headers.cookie?.split('=')[1] as string;

        const JWTCookieName = req.headers.cookie?.split('=')[0] as string;

        const checkIsAreJWTCookie = JWTCookie?.split('.'); // Um JWTCookie Verdadeiro tem 3 PONTOS !! <<    

            // Permitir o session_admin TAMBÉM porque também é um Usuário !! <<
        if(checkIsAreJWTCookie?.length !== 3 || JWTCookieName !== 'session_app' && JWTCookieName !== 'session_admin'){
            console.log('ERRADOOOO')
            res.clearCookie(JWTCookieName);
            return res.redirect('/account');
        }

        try{
            const verifyJWT = jwt.verify(JWTCookie, "" + process.env.JWT_HASH);

            if(verifyJWT){
                return next();
            }
        }
        catch(error){
            res.clearCookie(JWTCookieName);
            res.redirect('/account');
        }

        next();
    }

    async checkIfAdminAreLogged(req: Request, res: Response, next: NextFunction){

        let objectAlertEJS: any = {
            invalidData: undefined,
            internalServerError: undefined,
            errorLogin: undefined
        };

        const JWTCookieName = req.headers.cookie?.split('=')[0] as string;
        const JWTCookie = req.headers.cookie?.split(';')[0].split('=')[1] as string;

        if(!JWTCookieName || JWTCookieName !== 'session_admin'){
            res.clearCookie(JWTCookieName);
            return res.redirect('/admin');
        }

        try{
            const verifyJWT = jwt.verify(JWTCookie, "" + process.env.JWT_HASH);

            const { id } = verifyJWT as any

            if(!id){
                objectAlertEJS.internalServerError = true;
                res.clearCookie(JWTCookieName);
                return res.render(administrationRouteHTML, objectAlertEJS);
            }

            else{
                objectAlertEJS.internalServerError = false;
            }

            const searchUserById = await AccountRepository.findOneBy({id})

            if(searchUserById?.type !== 'admin'){
                res.clearCookie(JWTCookieName);
                objectAlertEJS.internalServerError = true;
                return res.redirect('/admin');
            }

            else{
                objectAlertEJS.internalServerError = false;
            }

            if(verifyJWT){
                return next();
            }
        }
        catch(error){
            res.clearCookie(JWTCookieName);
            res.redirect('/admin');
        }

        next(); 
    }

    async blockRegisterLoginPageIfLogged(req: Request, res: Response, next: NextFunction){
        const JWTCookieName = req.headers.cookie?.split('=')[0] as string;
        const JWTCookie = req.headers.cookie?.split(';')[0].split('=')[1] as string;

            // Permitir o session_admin TAMBÉM porque também é um Usuário !! <<
        if(JWTCookieName !== 'session_app' && JWTCookieName !== 'session_admin'){ 
            res.clearCookie(JWTCookieName);
            return next(); // next nesse caso Apenas Retorna para a Página de Login, porque é o Código passado APÓS esse Middleware !! <<
        }

        try{
            const verifyJWTCookie = jwt.verify(JWTCookie, "" + process.env.JWT_HASH);

            if(verifyJWTCookie){
                return res.redirect('/dashboard');
            }
        }
        catch(error){
            res.clearCookie(JWTCookieName);
            next();
        }
    }

    async blockAdminPageIfLogged(req: Request, res: Response, next: NextFunction){
        const JWTCookieName = req.headers.cookie?.split('=')[0] as string;
        const JWTCookie = req.headers.cookie?.split(';')[0].split('=')[1] as string;

        if(!JWTCookieName || JWTCookieName !== 'session_admin'){
            res.clearCookie(JWTCookieName);
            return next();
        }

        try{
            const verifyJWT = jwt.verify(JWTCookie, "" + process.env.JWT_HASH);

            if(verifyJWT){
                return res.redirect('/administration');
            }
        }
        catch(error){
            res.clearCookie(JWTCookieName);
            next();
        }
    }
}