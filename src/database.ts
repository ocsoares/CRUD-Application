import 'dotenv/config'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,

    entities: [`${__dirname}/**/entity/*.{ts,js}`],
    migrations: [`${__dirname}/**/migration/*.{ts,js}`],

    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})