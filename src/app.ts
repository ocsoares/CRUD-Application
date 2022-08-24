import 'dotenv/config'
import express from 'express'
import path from 'path'
import { AppDataSource } from './database'
import registerLoginRoute from './routes/register-login.route'
import cors from 'cors'

AppDataSource.initialize().then(() => {
    const server = express();

    const localHost = 'http://localhost';
    const port = 5000;
    const __dirname = path.resolve();

    server.set('trust proxy', 1);
    
    server.use(cors());
    server.use(express.static(__dirname + '/src/public'));

    server.use(registerLoginRoute);

    return server.listen(process.env.PORT || port, () => {
        if(process.env.NODE_ENV === 'production'){
            console.log('Servidor rodando remotamente no Heroku !');
        }

        else{
            console.log(`Servidor rodando localmente em ${localHost}:${port}`);
        }
    })
})