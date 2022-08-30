import { AppDataSource } from "../database";
import { ResetPasswords } from "../database/entity/ResetPasswords";

export const ResetPasswordsRepository = AppDataSource.getRepository(ResetPasswords);