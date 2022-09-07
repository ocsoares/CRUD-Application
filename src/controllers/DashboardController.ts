import { Request, Response, NextFunction } from 'express';
import { AccountRepository } from '../repositories/AccountRepository';
import { PostsRepository } from '../repositories/PostsRepository';

export class DashboardController{
    async createPost(req: Request, res: Response, next: NextFunction){

            // NÃO peguei o author, email e date porque ESTAVA DANDO undefined (pq o value está fixo), então peguei essas infos do req.JWTLogged !! <<
        const { title, post } = req.body
        const { username, email } = req.JWTLogged;

        const author = username
        const date = new Date().toLocaleDateString('pt-BR');

        const searchUserByEmail = await AccountRepository.findOneBy({email})
        const searchTitle = await PostsRepository.findOneBy({title});

        if(title.length > 42){
            req.flash('errorFlash', 'Número máximo de caracteres ultrapassado no título!');
            return res.redirect('/createpost');
        }

        if(post.length > 1000){
            req.flash('errorFlash', 'Número maximo de caracteres ultrapassado na postagem !');
            return res.redirect('/createpost');
        }
        
        console.log('INFOS:', {
            author,
            email,
            title,
            date,
            post
        })

        if(!searchUserByEmail){
            req.flash('errorFlash', 'Não foi possível acessar sua conta !');
            return res.redirect('/logout');
        }

            // ARRUMAR ISSO AQUI porque com value no EJS retorna undefined !! <<
        if(!title || !post){
            req.flash('errorFlash', 'Preencha todos os campos !');
            return res.redirect('/createpost');
        }

        if(searchTitle){
            req.flash('errorFlash', 'Já existe uma postagem com esse título !');
            return res.redirect('/createpost');
        }

        const createPost = PostsRepository.create({
            author,
            title,
            text: post,
            published_in: date
        })

        await PostsRepository.save(createPost);

        req.flash('successFlash', 'Postagem criada com sucesso !');
        return res.redirect('/myposts');
    }
}