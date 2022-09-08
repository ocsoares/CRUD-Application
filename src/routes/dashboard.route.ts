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

dashboardRoute.get('/dashboard', new VerificationAccount().checkIfUserAreLogged, (req: Request, res: Response) => {
    res.render(dashboardEJS);
});

    // FAZER uma Rota para PESQUISAR Posts no Dashboard !! <<
// dashboardRoute.post('/dashboard', new VerificationAccount().checkIfUserAreLogged, pesquisar..., (req: Request, res: Response) => {
// })

dashboardRoute.get('/myposts', new VerificationAccount().checkIfUserAreLogged, async (req: Request, res: Response) => {
    const { username } = req.JWTLogged;

    try{
        const searchAuthorPost = await PostsRepository.query(`SELECT * FROM posts WHERE author = '${username}'`);
        console.log(searchAuthorPost);

        return res.render(myPostsEJS, { searchAuthorPost });
    }
    catch(error){
        req.flash('errorFlash', 'Não foi possível acessar essa conta !');
        return res.redirect('/logout');
    }
})

    // Fazer um EJS para Visualizar uma Postagem COMPLETA !! <<
dashboardRoute.get('/viewpost/:idPost', new VerificationAccount().checkIfUserAreLogged, async (req: Request, res: Response) => {
    const { idPost } = req.params

    try{
    const searchPost = await PostsRepository.findOneBy({id: Number(idPost)});
    console.log('POST:', searchPost);

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

    // FAZER uma Rota para PESQUISAR Posts no Myposts !! <<
// dashboardRoute.post('/myposts', new VerificationAccount().checkIfUserAreLogged, pesquisar..., (req: Request, res: Response) => {
// })

dashboardRoute.get('/createpost', new VerificationAccount().checkIfUserAreLogged, async (req: Request, res: Response) => {
        // Usar esse JWTLogged para colocar os Valores FIXOS no EJS !! <<
    const { id } = req.JWTLogged;

    const currentTime = new Date().toLocaleDateString('pt-BR');

    try{
        const searchUserByID = await AccountRepository.findOneBy({id});
        console.log(searchUserByID);

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