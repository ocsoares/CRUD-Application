import { AppDataSource } from "../config/database";
import { LogsAdmin } from "../database/entity/LogsAdmin";

export const LogsAdminRepository = AppDataSource.getRepository(LogsAdmin);