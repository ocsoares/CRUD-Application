"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = require("express");
var AccountController_1 = require("../controllers/AccountController");
var registerLoginRoute = (0, express_1.Router)();
var __dirname = path_1.default.resolve();
var registerLoginRouteHTML = path_1.default.join(__dirname, '/src/public/html/signup-login.html');
registerLoginRoute.use(body_parser_1.default.urlencoded({ extended: true }));
registerLoginRoute.use(body_parser_1.default.json());
registerLoginRoute.use(body_parser_1.default.text({ type: 'text/json' }));
registerLoginRoute.get('/account', function (req, res) {
    console.log('Você está na página de registro !');
    res.sendFile(registerLoginRouteHTML);
});
registerLoginRoute.post('/account', new AccountController_1.AccountController().registerOrLoginAccount, function (req, res) {
});
exports.default = registerLoginRoute;
