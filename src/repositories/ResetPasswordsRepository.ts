import { AppDataSource } from "../config/database";
import { ResetPasswords } from "../database/entity/ResetPasswords";

export const ResetPasswordsRepository = AppDataSource.getRepository(ResetPasswords);