import { AppDataSource } from "../config/database";
import { Session } from "../database/entity/TypeormStore";

export const TypeormStoreRepository = AppDataSource.getRepository(Session);