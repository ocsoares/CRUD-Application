import { NextFunction, Request, Response } from "express"
import { AccountRepository } from '../repositories/AccountRepository'
import path from "path";

const __dirname = path.resolve();

const registerLoginRouteHTML = path.join(__dirname, '/src/views/signup-login.ejs');
const administrationRouteHTML = path.join(__dirname, '/src/views/admin-panel.ejs');

// PROCURAR UMA Layout Form para ADMIN e fazer uma Rota para Login de Admin's !! <<<
//  OBS: Os admins vão ser setados Diretamente no Banco de Dados, Alterando o type (acho....) !! <<
// >> Nessa lógica, todos os Usuários Registrado AQUI NÃO serão admin's !! <<

// Pesquisar e APLICAR aquelas Flash Messages !! <<

export class AccountController{
    async registerOrLoginAccount(req: Request, res: Response, next: NextFunction){
        console.log('req.body INTEIRO:', req.body);

        const { 
            registerUsername,
            registerEmail,
            registerPassword,
            registerConfirmPassword,
         } = req.body

         const { loginEmail, loginPassword } = req.body

            // REGISTRO !!! <<<<<<<<
        if(registerUsername && registerEmail && registerPassword && registerConfirmPassword){
            console.log('REGISTRO !!');

            console.log('req.body Register:', {
                registerUsername,
                registerEmail,
                registerPassword,
                registerConfirmPassword
            });

        }
        // --------------------------------


            // LOGIN !!! <<<<<<<<
        else if(loginEmail && loginPassword){
            console.log('LOGIN !!');

            console.log('req.body Login:', loginEmail, loginPassword);
        }
        // --------------------------------

        else{
            console.log('INVÁLIDO !');

            const invalidData = 'invalidData';

            return res.render(registerLoginRouteHTML, { invalidData });
        }

        next();
    }
    
    async adminPanelLogin(req: Request, res: Response, next: NextFunction){
        const { email, password } = req.body

        if(!email || !password){
            console.log('Dados inexistentes !');
            return res.render(administrationRouteHTML);
        }

        console.log('req.body INTEIRO:', req.body);

        console.log('Email:', email);
        console.log('Password:', password);

        next();
    }
}