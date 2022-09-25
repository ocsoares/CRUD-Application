import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { AccountRepository } from '../repositories/AccountRepository';
import { PostsRepository } from '../repositories/PostsRepository';

const __dirname = path.resolve();

const searchUserDashboardEJS = path.join(__dirname, '/src/views/post-layouts/search-post-dashboard.ejs');
const searchUserMyPostsEJS = path.join(__dirname, '/src/views/post-layouts/search-post-myposts.ejs');
export class DashboardController {
    async createPost(req: Request, res: Response, next: NextFunction) {

        // NÃO peguei o author, email e date porque ESTAVA DANDO undefined (pq o value está fixo), então peguei essas infos do req.JWTLogged !! <<
        const { title, post } = req.body;
        const { username, email } = req.JWTLogged;

        const author = username;
        const date = new Date().toLocaleDateString('pt-BR');

        const searchUserByEmail = await AccountRepository.findOneBy({ email });
        const searchTitle = await PostsRepository.findOneBy({ title });

        if (title.length > 42) {
            req.flash('errorFlash', 'Número máximo de caracteres ultrapassado no título!');
            return res.redirect('/createpost');
        }

        if (post.length > 1000) {
            req.flash('errorFlash', 'Número maximo de caracteres ultrapassado na postagem !');
            return res.redirect('/createpost');
        }

        if (!searchUserByEmail) {
            req.flash('errorFlash', 'Não foi possível acessar sua conta !');
            return res.redirect('/logout');
        }

        // ARRUMAR ISSO AQUI porque com value no EJS retorna undefined !! <<
        if (!title || !post) {
            req.flash('errorFlash', 'Preencha todos os campos !');
            return res.redirect('/createpost');
        }

        if (searchTitle) {
            req.flash('errorFlash', 'Já existe uma postagem com esse título !');
            return res.redirect('/createpost');
        }

        const createPost = PostsRepository.create({
            author,
            title,
            text: post,
            published_in: date
        });

        await PostsRepository.save(createPost);

        req.flash('successFlash', 'Postagem criada com sucesso !');
        return res.redirect('/myposts');
    }

    // Por algum motivo, o AJAX no .ejs NÃO Redireciona e NÃO permite usar o req.flash !! <<  
    async deletePost(req: Request, res: Response, next: NextFunction) {
        const { idPost } = req.params;

        const searchPost = await PostsRepository.findOneBy({ id: idPost });

        if (!searchPost) {
            req.flash('errorFlash', 'Não foi possível localizar a postagem !');
            return res.redirect('/myposts');
        }

        await PostsRepository.delete(idPost);
    }

    async searchPostDashboard(req: Request, res: Response, next: NextFunction) {
        const search = '%' + req.body.search + '%';

        try {
            const searchPostDatabase = await PostsRepository.query(`SELECT * FROM posts WHERE author LIKE '${search}' OR title LIKE '${search}' OR published_in LIKE '${search}'`);

            if (searchPostDatabase.length === 0) {
                req.flash('errorFlash', 'Não foi possível encontrar o post !');
                return res.redirect('/dashboard');
            }

            return res.render(searchUserDashboardEJS, { searchPostDatabase });
        }
        catch (error) {
            req.flash('errorFlash', 'Não foi possível encontrar o posr !');
            return res.redirect('/dashboard');
        }
    }

    async searchPostMyPosts(req: Request, res: Response, next: NextFunction) {
        const search = req.body.search + '%';
        const { username } = req.JWTLogged;

        try {
            const searchPostDatabase = await PostsRepository.query(`SELECT * FROM posts WHERE author = '${username}' AND title LIKE '${search}'\
                                                                    OR published_in LIKE '${search}' and author = '${username}'`);

            if (searchPostDatabase.length === 0) {
                req.flash('errorFlash', 'Não foi possível encontrar o post !');
                return res.redirect('/myposts');
            }

            return res.render(searchUserMyPostsEJS, { searchPostDatabase });

        }
        catch (error) {
            console.log(error);
            req.flash('errorFlash', 'Não foi possível encontrar o post !');
            return res.redirect('/myposts');
        }
    }
}