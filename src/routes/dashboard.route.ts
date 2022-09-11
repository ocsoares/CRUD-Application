import { Request, Response, Router } from "express";
import path from "path";
import { AccountController } from "../controllers/AccountController";
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
const dashboardViewPost = path.join(__dirname, '/src/views/post-layouts/dashboard-viewpost.ejs');

dashboardRoute.get('/dashboard', new VerificationAccount().checkIfUserAreLogged, async (req: Request, res: Response) => {
    const searchAllPosts = await PostsRepository.query('SELECT * FROM POSTS');

    res.render(dashboardEJS, { searchAllPosts });
});

    // Rota para Pesquisar Posts no Dashboard !! <<
dashboardRoute.post('/dashboard', new VerificationAccount().checkIfUserAreLogged, new DashboardController().searchPostDashboard, (req: Request, res: Response) => {
})

dashboardRoute.get('/dashboard/viewpost/:idPost', new VerificationAccount(). checkIfUserAreLogged, async (req: Request, res: Response) => {
    const { idPost } = req.params;

    try{
        const searchPost = await PostsRepository.findOneBy({id: idPost});

        if(!searchPost){
            req.flash('errorFlash', 'Post não encontrado !');
            return res.redirect('/dashboard');
        }
    
        return res.render(dashboardViewPost, { searchPost });
    }
    catch(error){
        req.flash('errorFlash', 'Post não encontrado !');
        return res.redirect('/dashboard');
    }
})

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

        // Rota para Pesquisar Posts no Minhas Postagens !! <<
dashboardRoute.post('/myposts', new VerificationAccount().checkIfUserAreLogged, new DashboardController().searchPostMyPosts, (req: Request, res: Response) => {
})

dashboardRoute.get('/myposts/viewpost/:idPost', new VerificationAccount().checkIfUserAreLogged, async (req: Request, res: Response) => {
    
    const { username } = req.JWTLogged;
    const { idPost } = req.params

    try{                    // Pesquisar no DB por Author e ID para EVITAR que OUTRO Usuário acesse !! <<
    const searchPost = await PostsRepository.findOneBy({author: username, id: idPost});

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

    // Rota para DELETAR uma Postagem do PRÓPRIO USUÁRIO !! <<
dashboardRoute.post('/myposts/viewpost/:idPost', new VerificationAccount().checkIfUserAreLogged, new DashboardController().deletePost, (req: Request, res: Response) => {
})

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