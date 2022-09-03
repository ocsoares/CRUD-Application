import { NextFunction, Request, Response } from "express"
import { AccountRepository } from '../repositories/AccountRepository'
import path from "path";
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ResetPasswordsRepository } from "../repositories/ResetPasswordsRepository";
import { redisClient } from "../config/redisConfig";

const __dirname = path.resolve();

const registerLoginRouteHTML = path.join(__dirname, '/src/views/signup-login.ejs');
const administrationRouteHTML = path.join(__dirname, '/src/views/admin-panel.ejs');
const forgotPasswordEJS = path.join(__dirname, '/src/views/forgotpassword.ejs');
const changeForgotPasswordEJS = path.join(__dirname, '/src/views/changeforgotpassword.ejs');

//  OBS: Os admins vão ser setados Diretamente no Banco de Dados, Alterando o type (acho....) !! <<
// >> Nessa lógica, todos os Usuários Registrado AQUI NÃO serão admin's !! <<
// Query Command: UPDATE accounts SET type = 'admin' WHERE id = ...

// Colocar Tamanho MÍNIMO para Usuários e Senhas !! <<

// Fazer uma Pequena LOGO de Home para voltar a Página de Login/Register !! <<

// Arrumar as Flash Messages, deixar apenas Mensagem de ERRO e SUCESSO, NÃO precisa mais que isso, porque pode se Escrever nelas... !! <<

export class AccountController{
    async registerOrLoginAccount(req: Request, res: Response, next: NextFunction){

            // Para funcionar aqui no Controller, tenho que colocar esse Objeto AQUI e nas Rotas !! <<
            //  OBS: Também tenho que passar esse Objeto no .render !! <<
            //  OBS: Tive que colocar aqui DENTRO para "resetar" a cada Chamada, pq os valores tavam ficando Fixo...

            // Register DATA
        const { 
            registerUsername,
            registerEmail,
            registerPassword,
            registerConfirmPassword,
         } = req.body

            // Login DATA
         const { loginEmail, loginPassword } = req.body

            // REGISTRO !!! <<<<<<<<
        if(registerUsername && registerEmail && registerPassword && registerConfirmPassword){

            const regexEmail = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

            const searchUserByUsername = await AccountRepository.findOneBy({username: registerUsername});
            const searchUserByEmail = await AccountRepository.findOneBy({email: registerEmail})


            if(searchUserByUsername){
                res.locals.alerts.userExists = true;
                return res.render(registerLoginRouteHTML, res.locals.alerts);
            }

            else{
                res.locals.alerts.userExists = false;
            }

            if(searchUserByEmail){
                res.locals.alerts.emailExists = true;
                return res.render(registerLoginRouteHTML, res.locals.alerts);
            }

            else{
                res.locals.alerts.emailExists = false;
            }

            if(!registerEmail.match(regexEmail)){
                res.locals.alerts.invalidEmail = true
                return res.render(registerLoginRouteHTML, res.locals.alerts);
            }

            else{
                res.locals.alerts.invalidEmail = false;
            }

            if(registerPassword !== registerConfirmPassword){
                res.locals.alerts.differentPasswords = true;
                return res.render(registerLoginRouteHTML, res.locals.alerts);
            }

            else{
                res.locals.alerts.differentPasswords = false;
            }

            const encryptPassword = await bcrypt.hash(registerPassword, 10);

            if(!encryptPassword){
                res.locals.alerts.internalServerError = true;
                return res.render(registerLoginRouteHTML, res.locals.alerts);
            }

            else{
                res.locals.alerts.internalServerError = false;
            }

            const createdDate = new Date().toLocaleDateString('pt-BR'); // Data atual, APENAS O Dia/Mes/Ano, SEM o Horário !! <<

            const saveNewAccount = AccountRepository.create({
                type: "user" ,
                username: registerUsername,
                email: registerEmail,
                password: encryptPassword,
                createdDate
            })

            await AccountRepository.save(saveNewAccount);            

            res.locals.alerts.successRegister = true
            return res.render(registerLoginRouteHTML, res.locals.alerts);
        }
        // --------------------------------


            // LOGIN !!! <<<<<<<<
        else if(loginEmail && loginPassword){
            const searchUserByEmail = await AccountRepository.findOneBy({email: loginEmail})

            if(!searchUserByEmail){
                // req.flash('errorFlash', 'testeum fi kkkkkkkk');
                // req.flash('errorFlash', 'f');
                // console.log('FLASH:', req.flash('errorFlash', 'testeum fi kkkkkkkk'));
                // return res.redirect('/account');
                res.locals.alerts.errorLogin = true;
                return res.render(registerLoginRouteHTML, res.locals.alerts);
            }

            const verifyPassword = await bcrypt.compare(loginPassword, searchUserByEmail.password);

            if(!verifyPassword){
                res.locals.alerts.errorLogin = true
                return res.render(registerLoginRouteHTML, res.locals.alerts);
            }

            const JWTCookie = jwt.sign({
                id: searchUserByEmail.id,
                username: searchUserByEmail.username,
                email: searchUserByEmail.email
            }, "" + process.env.JWT_HASH, {
                expiresIn: '12h',
            });

            res.cookie('session_auth', JWTCookie, {
                httpOnly: true
            })

            res.redirect('/dashboard');
            
            next();
        }
        // --------------------------------

        else{
            console.log('INVÁLIDO !');

            res.locals.alerts.invalidData = true;

            return res.render(registerLoginRouteHTML, res.locals.alerts);
        }

    }

    async logoutAccount(req: Request, res: Response, next: NextFunction){

        const sessionAuthNameIndex = Object.keys(req.cookies).indexOf('session_auth');
        const sessionAuthName = Object.keys(req.cookies)[sessionAuthNameIndex]

        const sessionAuthAdminNameIndex = Object.keys(req.cookies).indexOf('session_authadmin');
        const sessionAuthAdminName = Object.keys(req.cookies)[sessionAuthAdminNameIndex];

        const JWTCode = req.JWTCodeLogged;
        const JWTPayload = req.JWTLogged;

        const redisBlackListExpire = 13 * 3600; // 13 Horas !

        await redisClient.set(`blackListJWT_${JWTCode}`, JWTCode, 'EX', redisBlackListExpire);
        console.log(`${JWTCode} cacheado com sucesso !`);

        res.clearCookie(sessionAuthName);
        res.clearCookie(sessionAuthAdminName);

        req.flash('successFlash', 'Conta deslogada com sucesso. Até mais !');
        return res.redirect('/account');
        next();
    }
    
    async adminPanelLogin(req: Request, res: Response, next: NextFunction){

        const { adminEmail, adminPassword } = req.body

        console.log('req.body INTEIRO:', req.body);

        if(!adminEmail || !adminPassword){
            res.locals.alerts.invalidData = true
            return res.render(administrationRouteHTML, res.locals.alerts);
        }

        else{
            res.locals.alerts.invalidData = false
        }

        const searchUserAdminByEmail = await AccountRepository.findOneBy({email: adminEmail});

        if(!searchUserAdminByEmail){
            res.locals.alerts.errorLogin = true;
            return res.render(administrationRouteHTML, res.locals.alerts);
        }

        else{
            res.locals.alerts.errorLogin = false;
        }

        console.log('TYPE ADMIN:', searchUserAdminByEmail.type);

        if(searchUserAdminByEmail.type !== 'admin' as any){
            console.log('NÃO É ADMIN KK !!');
            res.locals.alerts.errorLogin = true;
            return res.render(administrationRouteHTML, res.locals.alerts);
        }

        else{
            res.locals.alerts.errorLogin = false;
        }

        const verifyAdminPassword = await bcrypt.compare(adminPassword, searchUserAdminByEmail.password);

        if(!verifyAdminPassword){
            res.locals.alerts.errorLogin = true;
            return res.render(administrationRouteHTML, res.locals.alerts);
        }

        else{
            res.locals.alerts.errorLogin = false;
        }

        const JWTCookie = jwt.sign({
            id: searchUserAdminByEmail.id,
            username: searchUserAdminByEmail.username,
            email: searchUserAdminByEmail.email
        }, "" + process.env.JWT_HASH, {
            expiresIn: '12h'
        })

        res.cookie('session_authadmin', JWTCookie, {
            httpOnly: true
        })

        res.redirect('/administration');

        next();
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction){

        const { forgotUsername, forgotEmail } = req.body

        const searchUserByEmail = await AccountRepository.findOneBy({email: forgotEmail});

        if(!searchUserByEmail){
            res.locals.alerts.errorForgotPassword = true;
            return res.render(forgotPasswordEJS, res.locals.alerts);
        }

        else{
            res.locals.alerts.errorForgotPassword = false;
        }

        if(forgotUsername !== searchUserByEmail.username){
            res.locals.alerts.errorForgotPassword = true;
            return res.render(forgotPasswordEJS, res.locals.alerts);
        }

        else{
            res.locals.alerts.errorForgotPassword = false;
        }

        const newDate = new Date();
        const currentTime = newDate.setMinutes(newDate.getMinutes());

        const searchUserResetPassword = await ResetPasswordsRepository.findOneBy({email: searchUserByEmail?.email});

        if(searchUserResetPassword){
            if(currentTime < searchUserResetPassword?.minuteToResetAgain){
                res.locals.alerts.passwordAlreadyChanged = true;
                return res.render(forgotPasswordEJS, res.locals.alerts);
            }

            else{
                res.locals.alerts.passwordAlreadyChanged = false;
            }
        }

        const JWT = jwt.sign({
            id: searchUserByEmail.id,
            type: searchUserByEmail.type,
            email: searchUserByEmail.email,
            username: searchUserByEmail.username
        },  "" + process.env.JWT_HASH, {
            expiresIn: '15m'
        });

        req.JWT = JWT;

        next();

        res.locals.alerts.successToSendEmail = true;
        return res.render(forgotPasswordEJS, res.locals.alerts);
    }

    async checkJWTParamsChangePassword(req: Request, res: Response, next: NextFunction){

        const { JWT } = req.params

        try{
            const verifyJWT = jwt.verify(JWT, "" + process.env.JWT_HASH) as JwtPayload;

            const { id, iat, exp } = verifyJWT;

            // O Token de Reset Password TEM que ter 15 Minutos de Expiração, então o Código abaixo EVITA ISSO !! >>
            if(iat && exp){ // If para EVITAR que seja Nulo !!
                if((exp - iat) / 60 !== 15){
                    req.flash('errorFlash', 'Token inválido ou expirado !');
                    return res.redirect('/forgotpassword');
                }
            }

            const searchUserById = await AccountRepository.findOneBy({id});

                // InternalServerError para quando o JWT for VÁLIDO, mas o ID NÃO existir no Banco de Dados !! <<
            if(!searchUserById){
                req.flash('errorFlash', 'Não foi possível consultar esse Usuário !');
                return res.redirect('/forgotpassword');
            }

            const searchUserResetByEmail = await ResetPasswordsRepository.findOneBy({email: searchUserById.email});

            const newDate = new Date();

            // USAR PARA EVITAR QUE ATUALIZE A SENHA DENOVO NO MESMO TOKEN !! <<
            const currentTime = newDate.setMinutes(newDate.getMinutes());

            if(searchUserResetByEmail){
                if(currentTime < searchUserResetByEmail.minuteToResetAgain){
                    req.flash('errorFlash', 'A senha já foi alterada recentemente !');
                    return res.redirect('/forgotpassword');
                }
            }

        }
        catch(error){
            req.flash('errorFlash', 'Token inválido ou expirado !');            
            return res.redirect('/forgotpassword');
        }

        next();
    }

    async changeForgotPassword(req: Request, res: Response, next: NextFunction){

        const { JWT } = req.params
        const { newPassword, confirmNewPassword } = req.body;

        if(!newPassword || !confirmNewPassword){
            res.locals.alerts.invalidData = true;
            return res.render(changeForgotPasswordEJS, res.locals.alerts);
        }
        else{
            res.locals.alerts.invalidData = false;
        }

        if(newPassword !== confirmNewPassword){
            res.locals.alerts.differentPasswords = true;
            return res.render(changeForgotPasswordEJS, res.locals.alerts);
        }
        else{
            res.locals.alerts.differentPasswords = false;
        }

        try{
            const verifyJWT = jwt.verify(JWT, "" + process.env.JWT_HASH) as JwtPayload; // JWT usado nesse caso Apenas para as Verificações abaixo !! <<
            console.log('verifyJWT:', verifyJWT);

            const { id, email, iat, exp } = verifyJWT;

            const searchUserByEmail = await AccountRepository.findOneBy({email})

            if(!searchUserByEmail){
                req.flash('errorFlash', 'Não foi possível consultar esse email !');
                return res.redirect('/forgotpassword');
            }

                    // ACHO que NÃO precisa disso porque vou por no checkJWT na URL !! <<
                // O Token de Reset Password TEM que tem 15 Minutos de Expiração, então o Código abaixo EVITA ISSO !! >>
            if(iat && exp){
                if((exp - iat) / 60 !== 15){
                    req.flash('errorFlash', 'Token inválido ou expirado !');
                    return res.redirect('/forgotpassword');
                }
            }

            const encryptPassword = await bcrypt.hash(newPassword, 10) as any;
            console.log('newPassword:', newPassword);
            console.log('ENCRYPT:', encryptPassword);

            await AccountRepository.update(id, {
                password: encryptPassword
            })

            const currentDayMonthYear = new Date().toLocaleDateString('pt-BR');

            const newDate = new Date();
            const nextTimeToResetAgain = newDate.setMinutes(newDate.getMinutes() + 60);

            const searchUserResetPassword = await ResetPasswordsRepository.findOneBy({email: email});
            console.log('PROCURE USERRESET:', searchUserResetPassword);
            
            if(!searchUserResetPassword){
                const createUserResetPassword = ResetPasswordsRepository.create({
                    email,
                    oldPassword: searchUserByEmail.password,
                    lastDateReset: currentDayMonthYear,
                    minuteToResetAgain: nextTimeToResetAgain
                });

                await ResetPasswordsRepository.save(createUserResetPassword);
            }

            else{
                await ResetPasswordsRepository.update(searchUserResetPassword.id, {
                    minuteToResetAgain: nextTimeToResetAgain
                });
            }

        }
        catch(error){
            req.flash('errorFlash', 'Token inválido ou expirado !');
            return res.redirect('/forgotpassword');
        }

        req.flash('successFlash', 'Senha alterada com sucesso !');
        res.redirect('/account');

        next();
    }
}