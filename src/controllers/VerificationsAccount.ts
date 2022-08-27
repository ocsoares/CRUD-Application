import { NextFunction, Request, Response } from "express";
import jwtCookie, { Secret } from 'jsonwebtoken' 

// CRIPTOGRAFAR O JWT na Geração dele e Conferir se o JWT no Cookie É Compatível AQUI !! <<<

export class VerificationAccount{
    async checkIfAreLogged(req: Request, res: Response, next: NextFunction){ // Verificar se é user ou admin !!
        // console.log('TESTE:', req.cookies);
        // console.log('HEADERS:', req.headers.cookie);

        // const JWTCookieCookie = req.headers.cookie?.split('=')[1];
        // console.log('JWTCookieCookie:', JWTCookieCookie);

        // const JWTCookieCookieName = req.headers.cookie?.split('=')[0];
        // console.log('JWTCookie NAME:', JWTCookieCookieName);

        // const checkIsAreJWTCookie = JWTCookieCookie?.split('.'); // Um JWTCookie Verdadeiro tem 3 PONTOS !! <<    

        // if(checkIsAreJWTCookie?.length !== 3 || JWTCookieCookieName !== 'session_app'){
        //     return res.redirect('/account');
        // }

        // console.log('PASSOU !!');

        // next();
    }

    async blockRegisterLoginPageIfLogged(req: Request, res: Response, next: NextFunction){
        const JWTCookieName = req.headers.cookie?.split('=')[0] as string;
        const JWTCookie = req.headers.cookie?.split(';')[0].split('=')[1] as string;

        console.log('NOME DO TOKEN:', JWTCookieName);

        if(JWTCookieName !== 'session_app'){ 
            res.clearCookie(JWTCookieName);
            return next(); // next nesse caso Apenas Retorna para a Página de Login, porque é o Código passado APÓS esse Middleware !! <<
        }

        try{
            const verifyJWTCookie = jwtCookie.verify(JWTCookie, "" + process.env.JWT_HASH);
            console.log(verifyJWTCookie);

            if(verifyJWTCookie){
                return res.redirect('/dashboard');
            }
        }
        catch(error){
            res.clearCookie(JWTCookieName);
            next();
        }
    }
}