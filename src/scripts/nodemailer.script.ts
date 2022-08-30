import { NextFunction, Request, response, Response } from "express";
import nodemailer from 'nodemailer'

    // Usar como MIDDLEWARE para pegar os Input's do req.body !! <<
export const sendNodemailerToResetPass = () => (req: Request, res: Response, next: NextFunction) => {

    const { forgotUsername, forgotEmail } = req.body

    const newTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'nodevalidation12@gmail.com',
            pass: process.env.NODEMAILER_PASS
        },
        tls: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } as any : false
    })

    newTransport.sendMail({
        from: 'Node Validation <nodevalidation12@gmail.com>',
        to: forgotEmail,
        subject: 'Link para resetar a senha',
        html: `<p>Olá ${forgotUsername}, segue o link para resetar a sua senha. Esse link irá se expirar em 15 minutos. Não compartilhe com ninguém e,\
        após alterada a senha, a próxima alteração só será possível após 1 hora.\n</p>
        <a href="http://localhost:5000/changepassword/${req.JWT}" target: "_blank">Clique aqui para ir para o link.</a>`
        
    })
        .then(response => console.log({
            message: 'Email enviado com sucesso',
            from: response.envelope.from,
            to: response.envelope.to
        }))
        .catch(console.log);

    next()

}