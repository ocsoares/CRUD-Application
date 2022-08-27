import { NextFunction, Request, Response } from "express"
import { AccountRepository } from '../repositories/AccountRepository'
import path from "path";
import bcrypt from 'bcrypt'
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken';

const __dirname = path.resolve();

const registerLoginRouteHTML = path.join(__dirname, '/src/views/signup-login.ejs');
const administrationRouteHTML = path.join(__dirname, '/src/views/admin-panel.ejs');

// PROCURAR UMA Layout Form para ADMIN e fazer uma Rota para Login de Admin's !! <<<
//  OBS: Os admins vão ser setados Diretamente no Banco de Dados, Alterando o type (acho....) !! <<
// >> Nessa lógica, todos os Usuários Registrado AQUI NÃO serão admin's !! <<
// Query Command: UPDATE accounts SET type = 'admin' WHERE id = ...

// Pesquisar e APLICAR aquelas Flash Messages !! <<

// Fazer um Sistema de ALTERA a Senha !! <<

    // Para funcionar aqui no Controller, tenho que colocar esse Objeto AQUI e nas Rotas !! <<
    //  OBS: Também tenho que passar esse Objeto no .render !! <<

// Adicionar no Banco de Dados A DATA que a Conta foi criada !! <<

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

            const saveNewAccount = AccountRepository.create({
                type: "user" ,
                username: registerUsername,
                email: registerEmail,
                password: encryptPassword
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

                // TENTAR COLOCAR ISSO NO DASHBOARD quando CONSEGUIR Logar !! <<
            // objectAlertEJS.successLogin = true;
            // res.render(registerLoginRouteHTML, objectAlertEJS);

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

        res.redirect('/administration');

        next();
    }
}