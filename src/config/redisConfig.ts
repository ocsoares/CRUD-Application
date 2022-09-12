import 'dotenv/config'
import Redis from 'ioredis'
import { ConnectionOptions } from 'tls'

const redisClient = new Redis({
    host: 'localhost' || process.env.REDIS_HOST,
    password: undefined || process.env.REDIS_PASS,
    tls: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false as ConnectionOptions
})

console.log('REDIS_HOST:', process.env.REDIS_HOST);
console.log('NODE_ENV:', process.env.NODE_ENV);

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