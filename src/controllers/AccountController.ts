import { NextFunction, Request, Response } from "express"
import { AccountRepository } from '../repositories/AccountRepository'
import path from "path";
import bcrypt from 'bcrypt'
import cookieParser from "cookie-parser";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ResetPasswordsRepository } from "../repositories/ResetPasswordsRepository";
import { ResetPasswords } from "../database/entity/ResetPasswords";

const __dirname = path.resolve();

const registerLoginRouteHTML = path.join(__dirname, '/src/views/signup-login.ejs');
const administrationRouteHTML = path.join(__dirname, '/src/views/admin-panel.ejs');
const forgotPasswordEJS = path.join(__dirname, '/src/views/forgotpassword.ejs');
const changeForgotPasswordEJS = path.join(__dirname, '/src/views/changeforgotpassword.ejs');

// PROCURAR UMA Layout Form para ADMIN e fazer uma Rota para Login de Admin's !! <<<
//  OBS: Os admins vão ser setados Diretamente no Banco de Dados, Alterando o type (acho....) !! <<
// >> Nessa lógica, todos os Usuários Registrado AQUI NÃO serão admin's !! <<
// Query Command: UPDATE accounts SET type = 'admin' WHERE id = ...

// Fazer um Sistema de ALTERA a Senha !! <<

    // Para funcionar aqui no Controller, tenho que colocar esse Objeto AQUI e nas Rotas !! <<
    //  OBS: Também tenho que passar esse Objeto no .render !! <<

// Adicionar no Banco de Dados A DATA que a Conta foi criada !! <<

// Colocar Tamanho MÍNIMO para Usuários e Senhas !! <<

// Bloquear um Email de Alterar a Senha SE JÁ Bloqueou Recentemente !! <<

// Fazer uma Pequena LOGO de Home para voltar a Página de Login/Register !! <<

// CACHEAR com Redis o JWT usado no Logout e no RESET da Senha !! <<

// Aprender o Connect-flash e Usar nas Rotas que NÃO da para mandar Mensagem depois de Redirecionado  (ex. Reset Pass) !! <<

export class AccountController{
    async registerOrLoginAccount(req: Request, res: Response, next: NextFunction){

            // Para funcionar aqui no Controller, tenho que colocar esse Objeto AQUI e nas Rotas !! <<
            //  OBS: Também tenho que passar esse Objeto no .render !! <<
            //  OBS: Tive que colocar aqui DENTRO para "resetar" a cada Chamada, pq os valores tavam ficando Fixo...
        let objectAlertEJS: any = {
            invalidData: undefined,
            userExists: undefined,
            emailExists: undefined,
            invalidEmail: undefined,
            successRegister: undefined,
            differentPasswords: undefined,
            internalServerError: undefined,
            errorLogin: undefined,
            successLogin: undefined
        }

        console.log('Teste do obj EJS:', objectAlertEJS.invalidEmail);
        console.log('req.body INTEIRO:', req.body);
        // console.log('TESTE:', objectAlertEJS.userExists);

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
                objectAlertEJS.userExists = true;
                return res.render(registerLoginRouteHTML, objectAlertEJS);
            }

            else{
                objectAlertEJS.userExists = false;
            }

            if(searchUserByEmail){
                objectAlertEJS.emailExists = true;
                return res.render(registerLoginRouteHTML, objectAlertEJS);
            }

            else{
                objectAlertEJS.emailExists = false;
            }

            if(!registerEmail.match(regexEmail)){
                objectAlertEJS.invalidEmail = true
                return res.render(registerLoginRouteHTML, objectAlertEJS);
            }

            else{
                objectAlertEJS.invalidEmail = false;
            }

            if(registerPassword !== registerConfirmPassword){
                objectAlertEJS.differentPasswords = true;
                return res.render(registerLoginRouteHTML, objectAlertEJS);
            }

            else{
                objectAlertEJS.differentPasswords = false;
            }

            const encryptPassword = await bcrypt.hash(registerPassword, 10);

            if(!encryptPassword){
                objectAlertEJS.internalServerError = true;
                return res.render(registerLoginRouteHTML, objectAlertEJS);
            }

            else{
                objectAlertEJS.internalServerError = false;
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

            objectAlertEJS.successRegister = true
            return res.render(registerLoginRouteHTML, objectAlertEJS);
        }
        // --------------------------------


            // LOGIN !!! <<<<<<<<
        else if(loginEmail && loginPassword){
            const searchUserByEmail = await AccountRepository.findOneBy({email: loginEmail})

            if(!searchUserByEmail){
                objectAlertEJS.errorLogin = true;
                return res.render(registerLoginRouteHTML, objectAlertEJS);
            }

            const verifyPassword = await bcrypt.compare(loginPassword, searchUserByEmail.password);

            if(!verifyPassword){
                objectAlertEJS.errorLogin = true
                return res.render(registerLoginRouteHTML, objectAlertEJS);
            }

            const JWTCookie = jwt.sign({
                id: searchUserByEmail.id,
                username: searchUserByEmail.username,
                email: searchUserByEmail.email
            }, "" + process.env.JWT_HASH, {
                expiresIn: '12h',
            });

            res.cookie('session_app', JWTCookie, {
                httpOnly: true
            })

            res.redirect('/dashboard');
            
            next();
        }
        // --------------------------------

        else{
            console.log('INVÁLIDO !');

            objectAlertEJS.invalidData = true;

            return res.render(registerLoginRouteHTML, objectAlertEJS);
        }

    }
    
    async adminPanelLogin(req: Request, res: Response, next: NextFunction){

        let objectAlertEJS: any = {
            invalidData: undefined,
            userExists: undefined,
            emailExists: undefined,
            invalidEmail: undefined,
            successRegister: undefined,
            differentPasswords: undefined,
            internalServerError: undefined,
            errorLogin: undefined,
            successLogin: undefined
        };

        const { adminEmail, adminPassword } = req.body

        console.log('req.body INTEIRO:', req.body);

        if(!adminEmail || !adminPassword){
            objectAlertEJS.invalidData = true
            return res.render(administrationRouteHTML, objectAlertEJS);
        }

        else{
            objectAlertEJS.invalidData = false
        }

        const searchUserAdminByEmail = await AccountRepository.findOneBy({email: adminEmail});

        if(!searchUserAdminByEmail){
            objectAlertEJS.errorLogin = true;
            return res.render(administrationRouteHTML, objectAlertEJS);
        }

        else{
            objectAlertEJS.errorLogin = false;
        }

        console.log('TYPE ADMIN:', searchUserAdminByEmail.type);

        if(searchUserAdminByEmail.type !== 'admin' as any){
            console.log('NÃO É ADMIN KK !!');
            objectAlertEJS.errorLogin = true;
            return res.render(administrationRouteHTML, objectAlertEJS);
        }

        else{
            objectAlertEJS.errorLogin = false;
        }

        const verifyAdminPassword = await bcrypt.compare(adminPassword, searchUserAdminByEmail.password);

        if(!verifyAdminPassword){
            objectAlertEJS.errorLogin = true;
            return res.render(administrationRouteHTML, objectAlertEJS);
        }

        else{
            objectAlertEJS.errorLogin = false;
        }

        const JWTCookie = jwt.sign({
            id: searchUserAdminByEmail.id,
            username: searchUserAdminByEmail.username,
            email: searchUserAdminByEmail.email
        }, "" + process.env.JWT_HASH, {
            expiresIn: '12h'
        })

        res.cookie('session_admin', JWTCookie, {
            httpOnly: true
        })

        res.redirect('/administration');

        next();
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction){

        let objectAlertEJS: any = {
            invalidData: undefined,
            errorForgotPassword: undefined,
            internalServerError: undefined,
            successToSendEmail: undefined,
            passwordAlreadyChanged: undefined
        };

        const { forgotUsername, forgotEmail } = req.body

        const searchUserByEmail = await AccountRepository.findOneBy({email: forgotEmail});

        if(!searchUserByEmail){
            objectAlertEJS.errorForgotPassword = true;
            return res.render(forgotPasswordEJS, objectAlertEJS);
        }

        else{
            objectAlertEJS.errorForgotPassword = false;
        }

        if(forgotUsername !== searchUserByEmail.username){
            objectAlertEJS.errorForgotPassword = true;
            return res.render(forgotPasswordEJS, objectAlertEJS);
        }

        else{
            objectAlertEJS.errorForgotPassword = false;
        }

        const newDate = new Date();
        const currentTime = newDate.setMinutes(newDate.getMinutes());

        const searchUserResetPassword = await ResetPasswordsRepository.findOneBy({email: searchUserByEmail?.email});

        if(searchUserResetPassword){
            if(currentTime < searchUserResetPassword?.minuteToResetAgain){
                objectAlertEJS.passwordAlreadyChanged = true;
                return res.render(forgotPasswordEJS, objectAlertEJS);
            }

            else{
                objectAlertEJS.passwordAlreadyChanged = false;
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

        objectAlertEJS.successToSendEmail = true;
        return res.render(forgotPasswordEJS, objectAlertEJS);
    }

    async checkJWTParamsChangePassword(req: Request, res: Response, next: NextFunction){

        let objectAlertEJS: any = {
            invalidData: undefined,
            differentPasswords: undefined,
            internalServerError: undefined,
            errorChangeForgotPassword: undefined,
            successChangeForgotPassword: undefined,
            invalidToken: undefined,
            errorForgotPassword: undefined,
            invalidEmail: undefined
        };

        const { JWT } = req.params

        try{
            const verifyJWT = jwt.verify(JWT, "" + process.env.JWT_HASH) as JwtPayload;

            const { id } = verifyJWT;

            const searchUserById = await AccountRepository.findOneBy({id});

            if(!searchUserById){
                objectAlertEJS.internalServerError = true;
                return res.render(forgotPasswordEJS, objectAlertEJS);
            }
            else{
                objectAlertEJS.internalServerError = false;
            }
        }
        catch(error){
            return res.redirect('/forgotpassword');
        }

        next();
    }

    async changeForgotPassword(req: Request, res: Response, next: NextFunction){

        let objectAlertEJS: any = {
            invalidData: undefined,
            differentPasswords: undefined,
            internalServerError: undefined,
            successChangeForgotPassword: undefined,
            invalidToken: undefined,
            passwordAlreadyChanged: undefined
        };

        const { JWT } = req.params
        const { newPassword, confirmNewPassword } = req.body;

        if(!newPassword || !confirmNewPassword){
            objectAlertEJS.invalidData = true;
            return res.render(changeForgotPasswordEJS, objectAlertEJS);
        }
        else{
            objectAlertEJS.invalidData = false;
        }

        if(newPassword !== confirmNewPassword){
            objectAlertEJS.differentPasswords = true;
            return res.render(changeForgotPasswordEJS, objectAlertEJS);
        }
        else{
            objectAlertEJS.differentPasswords = false;
        }

        try{
            const verifyJWT = jwt.verify(JWT, "" + process.env.JWT_HASH) as JwtPayload;
            console.log('verifyJWT:', verifyJWT);

            const { id, email, iat, exp } = verifyJWT;

            const searchUserByEmail = await AccountRepository.findOneBy({email})

            if(!searchUserByEmail){
                objectAlertEJS.internalServerError = true;
                return res.render(changeForgotPasswordEJS, objectAlertEJS);
            }

            else{
                objectAlertEJS.internalServerError = false;
            }

                // O Token de Reset Password TEM que tem 15 Minutos de Expiração, então o Código abaixo EVITA ISSO !! >>
            if(iat && exp){
                if((exp - iat) / 60 !== 15){
                    console.log('JWT INCORRETO !');
                    return res.redirect('/forgotpassword');
                }
                else{
                    console.log('JWT CORRETO !');
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

                // USAR PARA EVITAR QUE ATUALIZE A SENHA DENOVO NO MESMO TOKEN !! <<
            const currentTime = newDate.setMinutes(newDate.getMinutes());

            const searchUserResetPassword = await ResetPasswordsRepository.findOneBy({email: email});
            console.log('PROCURE USERRESET:', searchUserResetPassword);
            
            if(!searchUserResetPassword){
                const createUserResetPassword = ResetPasswordsRepository.create({
                    email,
                    oldPassword: searchUserByEmail.password,
                    resetOnDate: currentDayMonthYear,
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
            console.log(error);

            objectAlertEJS.invalidToken = true;
            return res.render(changeForgotPasswordEJS, objectAlertEJS)
        }

        objectAlertEJS.invalidToken = false;

        next();

            // TENTAR COLOCAR UM AVISO COM FLASH MESSAGE !! <<
        // objectAlertEJS.successChangeForgotPassword = true;
        // return res.render(changeForgotPasswordEJS, objectAlertEJS);

        res.redirect('/account');
    }
}