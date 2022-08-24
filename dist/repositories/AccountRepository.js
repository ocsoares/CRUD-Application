"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
var database_1 = require("../database");
var Account_1 = require("../database/entity/Account");
exports.AccountRepository = database_1.AppDataSource.getRepository(Account_1.Account);
