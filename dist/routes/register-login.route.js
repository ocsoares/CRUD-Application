"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var express_1 = require("express");
var AccountController_1 = require("../controllers/AccountController");
var registerLoginRoute = (0, express_1.Router)();
var __dirname = path_1.default.resolve();
var objectAlertEJS = {
    invalidData: undefined,
    userExists: undefined,
    emailExists: undefined,
    invalidEmail: undefined,
    successRegister: undefined,
    differentPasswords: undefined,
    internalServerError: undefined,
    errorLogin: undefined,
    successLogin: undefined
};
var registerLoginRouteHTML = path_1.default.join(__dirname, '/src/views/signup-login.ejs');
registerLoginRoute.get('/account', function (req, res) {
    req.flash('success', 'teste boy...');
    res.render(registerLoginRouteHTML, objectAlertEJS);
});
registerLoginRoute.post('/account', new AccountController_1.AccountController().registerOrLoginAccount, function (req, res) {
    res.redirect('/account');
});
exports.default = registerLoginRoute;
