"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
var AccountRepository_1 = require("../repositories/AccountRepository");
var path_1 = __importDefault(require("path"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var __dirname = path_1.default.resolve();
var registerLoginRouteHTML = path_1.default.join(__dirname, '/src/views/signup-login.ejs');
var administrationRouteHTML = path_1.default.join(__dirname, '/src/views/admin-panel.ejs');
var AccountController = (function () {
    function AccountController() {
    }
    AccountController.prototype.registerOrLoginAccount = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var objectAlertEJS, _a, registerUsername, registerEmail, registerPassword, registerConfirmPassword, _b, loginEmail, loginPassword, regexEmail, searchUserByUsername, searchUserByEmail, encryptPassword, saveNewAccount, searchUserByEmail, verifyPassword;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        objectAlertEJS = {
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
                        console.log('Teste do obj EJS:', objectAlertEJS.invalidEmail);
                        console.log('req.body INTEIRO:', req.body);
                        _a = req.body, registerUsername = _a.registerUsername, registerEmail = _a.registerEmail, registerPassword = _a.registerPassword, registerConfirmPassword = _a.registerConfirmPassword;
                        _b = req.body, loginEmail = _b.loginEmail, loginPassword = _b.loginPassword;
                        if (!(registerUsername && registerEmail && registerPassword && registerConfirmPassword)) return [3, 5];
                        regexEmail = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
                        return [4, AccountRepository_1.AccountRepository.findOneBy({ username: registerUsername })];
                    case 1:
                        searchUserByUsername = _c.sent();
                        return [4, AccountRepository_1.AccountRepository.findOneBy({ email: registerEmail })];
                    case 2:
                        searchUserByEmail = _c.sent();
                        if (searchUserByUsername) {
                            objectAlertEJS.userExists = true;
                            return [2, res.render(registerLoginRouteHTML, objectAlertEJS)];
                        }
                        else {
                            objectAlertEJS.userExists = false;
                        }
                        if (searchUserByEmail) {
                            objectAlertEJS.emailExists = true;
                            return [2, res.render(registerLoginRouteHTML, objectAlertEJS)];
                        }
                        else {
                            objectAlertEJS.emailExists = false;
                        }
                        if (!registerEmail.match(regexEmail)) {
                            objectAlertEJS.invalidEmail = true;
                            return [2, res.render(registerLoginRouteHTML, objectAlertEJS)];
                        }
                        else {
                            objectAlertEJS.invalidEmail = false;
                        }
                        if (registerPassword !== registerConfirmPassword) {
                            objectAlertEJS.differentPasswords = true;
                            return [2, res.render(registerLoginRouteHTML, objectAlertEJS)];
                        }
                        else {
                            objectAlertEJS.differentPasswords = false;
                        }
                        return [4, bcrypt_1.default.hash(registerPassword, 10)];
                    case 3:
                        encryptPassword = _c.sent();
                        if (!encryptPassword) {
                            objectAlertEJS.internalServerError = true;
                            return [2, res.render(registerLoginRouteHTML, objectAlertEJS)];
                        }
                        else {
                            objectAlertEJS.internalServerError = false;
                        }
                        saveNewAccount = AccountRepository_1.AccountRepository.create({
                            type: "user",
                            username: registerUsername,
                            email: registerEmail,
                            password: encryptPassword
                        });
                        return [4, AccountRepository_1.AccountRepository.save(saveNewAccount)];
                    case 4:
                        _c.sent();
                        objectAlertEJS.successRegister = true;
                        return [2, res.render(registerLoginRouteHTML, objectAlertEJS)];
                    case 5:
                        if (!(loginEmail && loginPassword)) return [3, 8];
                        return [4, AccountRepository_1.AccountRepository.findOneBy({ email: loginEmail })];
                    case 6:
                        searchUserByEmail = _c.sent();
                        if (!searchUserByEmail) {
                            objectAlertEJS.errorLogin = true;
                            return [2, res.render(registerLoginRouteHTML, objectAlertEJS)];
                        }
                        return [4, bcrypt_1.default.compare(loginPassword, searchUserByEmail.password)];
                    case 7:
                        verifyPassword = _c.sent();
                        if (!verifyPassword) {
                            objectAlertEJS.errorLogin = true;
                            return [2, res.render(registerLoginRouteHTML, objectAlertEJS)];
                        }
                        res.redirect('/dashboard');
                        next();
                        return [3, 9];
                    case 8:
                        console.log('INVÁLIDO !');
                        objectAlertEJS.invalidData = true;
                        return [2, res.render(registerLoginRouteHTML, objectAlertEJS)];
                    case 9: return [2];
                }
            });
        });
    };
    AccountController.prototype.adminPanelLogin = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password;
            return __generator(this, function (_b) {
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    console.log('Dados inexistentes !');
                    return [2, res.render(administrationRouteHTML)];
                }
                console.log('req.body INTEIRO:', req.body);
                console.log('Email:', email);
                console.log('Password:', password);
                next();
                return [2];
            });
        });
    };
    return AccountController;
}());
exports.AccountController = AccountController;
