"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var database_1 = require("./database");
var register_login_route_1 = __importDefault(require("./routes/register-login.route"));
var cors_1 = __importDefault(require("cors"));
database_1.AppDataSource.initialize().then(function () {
    var server = (0, express_1.default)();
    var localHost = 'http://localhost';
    var port = 5000;
    var __dirname = path_1.default.resolve();
    server.set('trust proxy', 1);
    server.use((0, cors_1.default)());
    server.use(express_1.default.static(__dirname + '/src/public'));
    server.use(register_login_route_1.default);
    return server.listen(process.env.PORT || port, function () {
        if (process.env.NODE_ENV === 'production') {
            console.log('Servidor rodando remotamente no Heroku !');
        }
        else {
            console.log("Servidor rodando localmente em ".concat(localHost, ":").concat(port));
        }
    });
});
