import { AppDataSource } from '../database'
import { Account } from '../database/entity/Account'

export const AccountRepository = AppDataSource.getRepository(Account);