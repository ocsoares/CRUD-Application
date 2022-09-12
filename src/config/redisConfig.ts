import 'dotenv/config'
import Redis from 'ioredis'
import { ConnectionOptions } from 'tls'

const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: undefined || process.env.REDIS_PASS,
    // tls: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false as ConnectionOptions
})

redisClient.on('connect', () => {
    if(process.env.NODE_ENV === 'production'){
        console.log('Redis rodando Remotamente no Render !');
    }

    else{
        console.log('Redis rodando localmente !');
    }
})

redisClient.on('error', (error) => {
    console.log(error.message);
})

export { redisClient };