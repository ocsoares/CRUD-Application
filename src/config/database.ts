import 'dotenv/config'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,

    entities: [`${__dirname}/../**/entity/*.{ts,js}`], // Como mudei para a Pasta config, tive que Alterar de /**/entity/ PARA /../**/entity/ !! <<
    migrations: [`${__dirname}/../**/migration/*.{ts,js}`],

    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})