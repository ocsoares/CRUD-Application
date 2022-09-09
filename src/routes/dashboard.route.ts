import { Request, Response, Router } from "express";
import path from "path";
import { DashboardController } from "../controllers/DashboardController";
import { VerificationAccount } from "../controllers/VerificationsAccount";
import { AccountRepository } from "../repositories/AccountRepository";
import { PostsRepository } from "../repositories/PostsRepository";

const dashboardRoute = Router();

const __dirname = path.resolve();

const dashboardEJS = path.join(__dirname, 'src/views/post-layouts/dashboard.ejs');
const myPostsEJS = path.join(__dirname, '/src/views/post-layouts/my-posts.ejs');
const createNewPostEJS = path.join(__dirname, '/src/views/post-layouts/create-new-post.ejs');
const viewPostEJS = path.join(__dirname, '/src/views/post-layouts/view-post.ejs');

// Tentar encryptar o URL nas Rotas (NÃO necessariamente daqui) que usa ID na URL !! << 

// No dashboard, mudar o EJS para mostrar TODAS as Postagens publicadas no Banco de Dados !! <<

// >>CRÍTICO<<: Arrumar para NÃO permitir acessar os Posts de OUTRO usuário no /viewpost/id, porque PODE EXCLUIR !! <<

dashboardRoute.get('/dashboard', new VerificationAccount().checkIfUserAreLogged, async (req: Request, res: Response) => {
    const searchAllPosts = await PostsRepository.query('SELECT * FROM POSTS');
    console.log('TODOS POSTS:', searchAllPosts);

    // TERMINAR ISSO !! <<

    res.render(dashboardEJS, { searchAllPosts });
});

    // FAZER uma Rota para PESQUISAR Posts no Dashboard !! <<
// dashboardRoute.post('/dashboard', new VerificationAccount().checkIfUserAreLogged, pesquisar..., (req: Request, res: Response) => {
// })

dashboardRoute.get('/myposts', new VerificationAccount().checkIfUserAreLogged, async (req: Request, res: Response) => {
    const { username } = req.JWTLogged;

    try{
        const searchAuthorPost = await PostsRepository.query(`SELECT * FROM posts WHERE author = '${username}'`);

        return res.render(myPostsEJS, { searchAuthorPost });
    }
    catch(error){
        req.flash('errorFlash', 'Não foi possível acessar essa conta !');
        return res.redirect('/logout');
    }
})

    // Fazer um EJS para Visualizar uma Postagem COMPLETA !! <<
dashboardRoute.get('/myposts/viewpost/:idPost', new VerificationAccount().checkIfUserAreLogged, async (req: Request, res: Response) => {
    
    const { username } = req.JWTLogged;
    const { idPost } = req.params

    try{                    // Pesquisar no DB por Author e ID para EVITAR que OUTRO Usuário acesse !! <<
    const searchPost = await PostsRepository.findOneBy({author: username, id: Number(idPost)});
    console.log(searchPost);

    if(!searchPost){
        req.flash('errorFlash', 'Post não encontrado !');
        return res.redirect('/myposts');
    }

    return res.render(viewPostEJS, { searchPost });
    }
    catch(error){
        req.flash('errorFlash', 'Post não encontrado !');
        return res.redirect('/myposts');
    }
})

dashboardRoute.post('/myposts/viewpost/:idPost', new VerificationAccount().checkIfUserAreLogged, new DashboardController().deletePost, (req: Request, res: Response) => {
})

    // FAZER uma Rota para PESQUISAR Posts no Myposts !! <<
// dashboardRoute.post('/myposts', new VerificationAccount().checkIfUserAreLogged, pesquisar..., (req: Request, res: Response) => {
// })

dashboardRoute.get('/createpost', new VerificationAccount().checkIfUserAreLogged, async (req: Request, res: Response) => {
        // Usar esse JWTLogged para colocar os Valores FIXOS no EJS !! <<
    const { id } = req.JWTLogged;

    const currentTime = new Date().toLocaleDateString('pt-BR');

    try{
        const searchUserByID = await AccountRepository.findOneBy({id});

        if(!searchUserByID){
            req.flash('errorFlash', 'Não foi possível acessar essa conta !');
            return res.redirect('/logout');
        }

        return res.render(createNewPostEJS, { searchUserByID, currentTime });
    }
    catch(error){
        req.flash('errorFlash', 'Não foi possível acessar essa conta !');
        return res.redirect('/logout');
    }
})

dashboardRoute.post('/createpost', new VerificationAccount().checkIfUserAreLogged, new DashboardController().createPost, (req: Request, res: Response) => {
})

export default dashboardRoute;