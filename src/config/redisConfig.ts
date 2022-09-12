import 'dotenv/config'
import Redis from 'ioredis'
import { ConnectionOptions } from 'tls'

const redisClient = new Redis(process.env.REDIS_URL || 'localhost', {
    password: undefined || process.env.REDIS_PASS,
    tls: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false as ConnectionOptions
})

console.log('REDIS_URL:', process.env.REDIS_URL);

redisClient.on('connect', () => {
    if(process.env.NODE_ENV === 'production'){
        console.log('Redis rodando Remotamente no Heroku !');
    }

    else{
        console.log('Redis rodando localmente !');
    }
})

redisClient.on('error', (error) => {
    console.log(error.message);
})

export { redisClient };