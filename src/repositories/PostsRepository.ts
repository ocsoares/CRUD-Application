import { AppDataSource } from "../config/database";
import { Posts } from "../database/entity/Posts";

export const PostsRepository = AppDataSource.getRepository(Posts);