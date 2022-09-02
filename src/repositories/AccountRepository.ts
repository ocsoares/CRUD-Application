import { AppDataSource } from '../config/database'
import { Account } from '../database/entity/Account'

export const AccountRepository = AppDataSource.getRepository(Account);