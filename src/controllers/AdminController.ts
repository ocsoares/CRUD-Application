import { Request, Response, NextFunction } from 'express'
import path from 'path';
import { AccountRepository } from '../repositories/AccountRepository'

const __dirname = path.resolve();

const administrationDashboardEJS = path.join(__dirname, '/src/views/logged-layouts/dashboard.ejs');

// Tentar permitir procurar pelo ID !! <<

export class AdminController{
    async searchUser(req: Request, res: Response, next: NextFunction){
        const searchReqBody = req.body.search + '%';
        console.log('REQ BODY:', searchReqBody);

        try{
                                                                                // Tive que por o body entre '' por causa do SQL !! <<
        const searchUserDatabase = await AccountRepository.query(`SELECT * FROM accounts WHERE username LIKE '${searchReqBody}' OR email LIKE '${searchReqBody}' `);
        console.log('DA DB:', searchUserDatabase);
        console.log('DB LENGHT:', typeof(searchReqBody));
        
            // ISSO AQUI DEU ERRADO, ACHAR OUTRO JEITO DE PEGAR O OBJETO DENTRO DO ARRAY !! <<
        if(!searchUserDatabase[0].value){
            console.log('TESTEEEEEEEEEEEEEEEE');
        }

        // Fiz essa Variável porque é o NOME da Variável do EJS responsável por MOSTRAR os Usuários !! <<
        const databaseUsers = searchUserDatabase;

        return res.render(administrationDashboardEJS, {databaseUsers});
        }
        catch(error){
            console.log(error);
            
            req.flash('errorFlash', 'Não foi possível encontrar o usuário !');
            return res.redirect('/administration');
        }
    }
}