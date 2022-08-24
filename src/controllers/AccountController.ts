import { Request, Response } from "express"
import { AccountRepository } from '../repositories/AccountRepository'
import path from "path";

const __dirname = path.resolve();
const registerLoginRouteHTML = path.join(__dirname, '/src/public/html/signup-login.html');

// PROCURAR UMA Layout Form para ADMIN e fazer uma Rota para Login de Admin's !! <<<
//  OBS: Os admins vão ser setados Diretamente no Banco de Dados, Alterando o type (acho....) !! <<
// >> Nessa lógica, todos os Usuários Registrado AQUI NÃO serão admin's !! <<

export class AccountController{
    async registerOrLoginAccount(req: Request, res: Response){
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
            return res.sendFile(registerLoginRouteHTML);
        }
    }
}