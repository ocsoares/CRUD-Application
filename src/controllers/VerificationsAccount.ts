import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import path from "path";
import { redisClient } from "../config/redisConfig";
import { AccountRepository } from "../repositories/AccountRepository";

const __dirname = path.resolve();

const administrationRouteHTML = path.join(__dirname, '/src/views/admin-panel.ejs');

//  OBS: Não limpei o Cookie na >Verificação do NOME< porque ele vai ser UNDEFINED se for inválido, então NÃO vai ter NOME e nem VALOR !! <<
// Logo, tudo abaixo dele VAI TER O NOME !! <<
export class VerificationAccount {
    async checkIfUserAreLogged(req: Request, res: Response, next: NextFunction) {

        // Valores dos Cookies !! <<
        const { session_auth } = req.cookies;
        const { session_authadmin } = req.cookies;

        // Index + Nome dos Cookies !! <<
        const sessionAuthNameIndex = Object.keys(req.cookies).indexOf('session_auth');
        const sessionAuthName = Object.keys(req.cookies)[sessionAuthNameIndex];

        const sessionAuthAdminNameIndex = Object.keys(req.cookies).indexOf('session_authadmin');
        const sessionAuthAdminName = Object.keys(req.cookies)[sessionAuthAdminNameIndex];

        // NÃO é permitido os Dois Cookies estarem Ativos ao MESMO TEMPO, se estiverem, LIMPAR !! <<
        if (sessionAuthName && sessionAuthAdminName) {
            res.clearCookie(sessionAuthName);
            res.clearCookie(sessionAuthAdminName);

            req.flash('errorFlash', 'Formato do Token inválido !');
            return res.redirect('/account');
        }

        try {
            const verifyJWT = jwt.verify(session_auth || session_authadmin, "" + process.env.JWT_HASH) as JwtPayload;

            const { id, username, email } = verifyJWT;

            // EVITA que o Usuário permaneça Logado após por algum Motivo o Usuário for deletado do Banco de Dados !! <<
            const checkIfUserExistsInDatabase = await AccountRepository.findOneBy({ id });

            // EVITA que se o Usuário mudar o Usuário/Email ainda Permaneça Logado com o MESMO JWT de Sessão !! <<
            if (checkIfUserExistsInDatabase?.username !== username || checkIfUserExistsInDatabase?.email !== email) {
                res.clearCookie(sessionAuthName);
                res.clearCookie(sessionAuthAdminName);

                req.flash('errorFlash', 'Informaçõe da conta alteradas ou inválidas !');
                return res.redirect('/account');
            }

            if (!checkIfUserExistsInDatabase) {
                res.clearCookie(sessionAuthName);
                res.clearCookie(sessionAuthAdminName);

                req.flash('errorFlash', 'Não foi possível localizar essa conta !');
                return res.redirect('/account');
            }

            const checkJWTBlacklist = await redisClient.get(`blackListJWT_${session_auth || session_authadmin}`);

            if (checkJWTBlacklist) {
                console.log('EXISTE !!');
                res.clearCookie(sessionAuthName || sessionAuthAdminName);

                req.flash('errorFlash', 'Token inválido ou expirado !');
                return res.redirect('/account');
            }

            // >>Coloquei aqui embaixo porque estava mostrando o Alerta ANTES !! <<
            // Permitir o session_authadmin TAMBÉM porque também é um Usuário !! <<
            if (sessionAuthName !== 'session_auth' && sessionAuthAdminName !== 'session_authadmin') {
                req.flash('errorFlash', 'Token inválido ou expirado !');
                return res.redirect('/account');
            }

            if (verifyJWT) {
                req.JWTLogged = verifyJWT;
                req.JWTCodeLogged = session_auth || session_authadmin;
                return next();
            }

        }
        catch (error) {
            res.clearCookie(sessionAuthName);
            res.clearCookie(sessionAuthAdminName);

            req.flash('errorFlash', 'É preciso estar autenticado para acessar essa rota !');
            return res.redirect('/account');
        }

        next();
    }

    async checkIfAdminAreLogged(req: Request, res: Response, next: NextFunction) {

        const sessionAuthAdminNameIndex = Object.keys(req.cookies).indexOf('session_authadmin');
        const sessionAuthAdminName = Object.keys(req.cookies)[sessionAuthAdminNameIndex];

        const { session_authadmin } = req.cookies;

        try {
            const verifyJWT = jwt.verify(session_authadmin, "" + process.env.JWT_HASH) as JwtPayload;

            const { id } = verifyJWT;

            const checkJWTBlacklist = await redisClient.get(`blackListJWT_${session_authadmin}`);

            if (checkJWTBlacklist) {
                console.log('EXISTE !!');
                res.clearCookie(sessionAuthAdminName);

                req.flash('errorFlash', 'Token inválido ou expirado !');
                return res.redirect('/admin');
            }

            if (sessionAuthAdminName !== 'session_authadmin') {
                res.clearCookie(sessionAuthAdminName);

                req.flash('errorFlash', 'Token inválido ou expirado !');
                return res.redirect('/admin');
            }

            if (!id) {
                res.clearCookie(sessionAuthAdminName);

                req.flash('errorFlash', 'Não foi possível consultar o ID !');
                return res.redirect('/admin');
            }

            // Evita que o Usuário permaneça Logado após por algum Motivo o Usuário for deletado do Banco de Dados !! <<
            const searchUserById = await AccountRepository.findOneBy({ id });

            if (!searchUserById) {
                res.clearCookie(sessionAuthAdminName);

                req.flash('errorFlash', 'Não foi possível localizar essa conta !');
                return res.redirect('/admin');
            }

            if (searchUserById?.type !== 'admin') {
                res.clearCookie(sessionAuthAdminName);

                req.flash('errorFlash', 'Apenas administradores podem acessar !');
                return res.redirect('/admin');
            }

            if (verifyJWT) {
                req.JWTLogged = verifyJWT;
                return next();
            }
        }
        catch (error) {
            res.clearCookie(sessionAuthAdminName);

            req.flash('errorFlash', 'É preciso estar autenticado para acessar essa rota !');
            return res.redirect('/admin');
        }

        next();
    }

    async blockRegisterLoginPageIfLogged(req: Request, res: Response, next: NextFunction) {
        const { session_auth } = req.cookies;
        const { session_authadmin } = req.cookies;

        const sessionAuthNameIndex = Object.keys(req.cookies).indexOf('session_auth');
        const sessionAuthName = Object.keys(req.cookies)[sessionAuthNameIndex];

        const sessionAuthAdminNameIndex = Object.keys(req.cookies).indexOf('session_authadmin');
        const sessionAuthAdminName = Object.keys(req.cookies)[sessionAuthAdminNameIndex];

        if (sessionAuthName !== 'session_auth' && sessionAuthAdminName !== 'session_authadmin') {
            // req.flash('errorFlash', 'Formato do Token inválido !');
            return next(); // Como a Próxima Página que esse Middlewara tá é /account, então NÃO precisa Redirecionar !! <<
        }

        try {
            if (session_auth) {
                const verifyJWT = jwt.verify(session_auth, "" + process.env.JWT_HASH);

                if (verifyJWT) {
                    return res.redirect('/dashboard');
                }
            }

            if (session_authadmin) {
                const verifyJWT = jwt.verify(session_authadmin, "" + process.env.JWT_HASH);

                if (verifyJWT) {
                    return res.redirect('/dashboard');
                }
            }
        }
        catch (error) {
            res.clearCookie(sessionAuthName);
            res.clearCookie(sessionAuthAdminName);

            req.flash('errorFlash', 'Token inválido ou expirado !');
            return next(); // Como a Próxima Página que esse Middlewara tá é /account, então NÃO precisa Redirecionar !! <<
        }

    }

    async blockAdminPageIfLogged(req: Request, res: Response, next: NextFunction) {
        const sessionAuthAdminNameIndex = Object.keys(req.cookies).indexOf('session_authadmin');
        const sessionAuthAdminName = Object.keys(req.cookies)[sessionAuthAdminNameIndex];

        const { session_authadmin } = req.cookies;

        if (sessionAuthAdminName !== 'session_authadmin') {
            res.clearCookie(sessionAuthAdminName);

            // req.flash('errorFlash', 'Formato do Token inválido !');
            return next();
        }

        try {
            const verifyJWT = jwt.verify(session_authadmin, "" + process.env.JWT_HASH);

            if (verifyJWT) {
                return res.redirect('/administration');
            }
        }
        catch (error) {
            res.clearCookie(sessionAuthAdminName);

            req.flash('errorFlash', 'Token inválido ou expirado !');
            return next();
        }
    }
}