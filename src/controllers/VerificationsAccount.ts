import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken' 
import path from "path";
import { redisClient } from "../config/redisConfig";
import { AccountRepository } from "../repositories/AccountRepository";

const __dirname = path.resolve();

const administrationRouteHTML = path.join(__dirname, '/src/views/admin-panel.ejs');

// Implementar Redis !! <<

//  OBS: Não limpei o Cookie na >Verificação do NOME< porque ele vai ser UNDEFINED se for inválido, então NÃO vai ter NOME e nem VALOR !! <<
// Logo, tudo abaixo dele VAI TER O NOME !! <<

// Fazer alertas no Flash caso for usar return res.redirect('...') !! <<

// Fazer um Alerta para o .catch !! <<

// POR ALGUM MOTIVO, o req.flash só está pegando em /account !! <<<<<
export class VerificationAccount{
    async checkIfUserAreLogged(req: Request, res: Response, next: NextFunction){
            // Valores dos Cookies !! <<
        const { session_auth } = req.cookies
        const { session_authadmin } = req.cookies

            // Index + Nome dos Cookies !! <<
        const sessionAuthNameIndex = Object.keys(req.cookies).indexOf('session_auth');
        const sessionAuthName = Object.keys(req.cookies)[sessionAuthNameIndex]

        const sessionAuthAdminNameIndex = Object.keys(req.cookies).indexOf('session_authadmin');
        const sessionAuthAdminName = Object.keys(req.cookies)[sessionAuthAdminNameIndex];

            // NÃO é permitido os Dois Cookies estarem Ativos ao MESMO TEMPO, se estiverem, LIMPAR !! <<
        if(sessionAuthName && sessionAuthAdminName){
            res.clearCookie(sessionAuthName);
            res.clearCookie(sessionAuthAdminName);

            req.flash('invalidTokenFlash', 'Formato do Token inválido !');
            return res.redirect('/account');
        }

        try{
                const verifyJWT = jwt.verify(session_auth || session_authadmin, "" + process.env.JWT_HASH);

                const checkJWTBlacklist = await redisClient.get(`blackListJWT_${session_auth || session_authadmin}`);
                console.log('CHECK BLACKLIST:', checkJWTBlacklist);

                if(checkJWTBlacklist){
                    console.log('EXISTE !!');
                    res.clearCookie(sessionAuthName || sessionAuthAdminName);

                    req.flash('invalidTokenFlash', 'Token inválido ou expirado !');
                    return res.redirect('/account');
                }

                // >>Coloquei aqui embaixo porque estava mostrando o Alerta ANTES !! <<
            // Permitir o session_authadmin TAMBÉM porque também é um Usuário !! <<
            if (sessionAuthName !== 'session_auth' && sessionAuthAdminName !== 'session_authadmin') {
                req.flash('invalidTokenFlash', 'Token inválido ou expirado !');
                return res.redirect('/account');
            }

            if (verifyJWT) {
                req.JWTLogged = verifyJWT;
                req.JWTCodeLogged = session_auth || session_authadmin;
                return next();
            }

        }
        catch(error){
            res.clearCookie(sessionAuthName);
            res.clearCookie(sessionAuthAdminName);
            
            req.flash('invalidTokenFlash', 'É preciso estar autenticado para acessar essa rota !');
            return res.redirect('/account');
        }

        next();
    }

    async checkIfAdminAreLogged(req: Request, res: Response, next: NextFunction){

        const sessionAuthAdminNameIndex = Object.keys(req.cookies).indexOf('session_authadmin');
        const sessionAuthAdminName = Object.keys(req.cookies)[sessionAuthAdminNameIndex];

        const { session_authadmin } = req.cookies

        try{
            const verifyJWT = jwt.verify(session_authadmin, "" + process.env.JWT_HASH);

            const checkJWTBlacklist = await redisClient.get(`blackListJWT_${session_authadmin}`);
                console.log('CHECK BLACKLIST:', checkJWTBlacklist);

                if(checkJWTBlacklist){
                    console.log('EXISTE !!');
                    res.clearCookie(sessionAuthAdminName);

                    req.flash('invalidTokenFlash', 'Token inválido ou expirado !');
                    return res.redirect('/admin');
                }

            if(sessionAuthAdminName !== 'session_authadmin'){
                res.clearCookie(sessionAuthAdminName);
    
                req.flash('invalidTokenFlash', 'Token inválido ou expirado !');
                return res.redirect('/admin');
            }

            const { id } = verifyJWT as any

            if(!id){
                res.clearCookie(sessionAuthAdminName);

                req.flash('internalServerErrorFlash', 'Não foi possível consultar o ID !');
                return res.redirect('/admin');
            }

            const searchUserById = await AccountRepository.findOneBy({id})

            if(searchUserById?.type !== 'admin'){
                res.clearCookie(sessionAuthAdminName);

                req.flash('permissionDeniedFlash', 'Apenas administradores podem acessar !');
                return res.redirect('/admin');
            }

            if(verifyJWT){
                return next();
            }
        }
        catch(error){
            res.clearCookie(sessionAuthAdminName);

            req.flash('invalidTokenFlash', 'É preciso estar autenticado para acessar essa rota !');
            return res.redirect('/admin');
        }

        next(); 
    }

    async blockRegisterLoginPageIfLogged(req: Request, res: Response, next: NextFunction){
        const { session_auth } = req.cookies
        const { session_authadmin } = req.cookies

        const sessionAuthNameIndex = Object.keys(req.cookies).indexOf('session_auth');
        const sessionAuthName = Object.keys(req.cookies)[sessionAuthNameIndex]

        const sessionAuthAdminNameIndex = Object.keys(req.cookies).indexOf('session_authadmin');
        const sessionAuthAdminName = Object.keys(req.cookies)[sessionAuthAdminNameIndex];

        if(sessionAuthName !== 'session_auth' && sessionAuthAdminName !== 'session_authadmin'){
            // req.flash('invalidTokenFlash', 'Formato do Token inválido !');
            return next(); // Como a Próxima Página que esse Middlewara tá é /account, então NÃO precisa Redirecionar !! <<
        }

        try{
            if(session_auth){
                const verifyJWT = jwt.verify(session_auth, "" + process.env.JWT_HASH);

                if(verifyJWT){
                    return res.redirect('/dashboard');
                }
            }
            
            if(session_authadmin){
                const verifyJWT = jwt.verify(session_authadmin, "" + process.env.JWT_HASH);

                if(verifyJWT){
                    return res.redirect('/dashboard');
                }
            }
        }
        catch(error){
            res.clearCookie(sessionAuthName);
            res.clearCookie(sessionAuthAdminName);

            req.flash('invalidTokenFlash', 'Token inválido ou expirado !');
            return next(); // Como a Próxima Página que esse Middlewara tá é /account, então NÃO precisa Redirecionar !! <<
        }

    }

    async blockAdminPageIfLogged(req: Request, res: Response, next: NextFunction){
        const sessionAuthAdminNameIndex = Object.keys(req.cookies).indexOf('session_authadmin');
        const sessionAuthAdminName = Object.keys(req.cookies)[sessionAuthAdminNameIndex];

        const { session_authadmin } = req.cookies

        if(sessionAuthAdminName !== 'session_authadmin'){
            res.clearCookie(sessionAuthAdminName);

            // req.flash('invalidTokenFlash', 'Formato do Token inválido !');
            return next();
        }

        try{
            const verifyJWT = jwt.verify(session_authadmin, "" + process.env.JWT_HASH);

            if(verifyJWT){
                return res.redirect('/administration');
            }
        }
        catch(error){
            res.clearCookie(sessionAuthAdminName);

            req.flash('invalidTokenFlash', 'Token inválido ou expirado !');
            return next();
        }
    }
}