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
var administration_route_1 = __importDefault(require("./routes/administration.route"));
var dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
var cors_1 = __importDefault(require("cors"));
var cookie_session_1 = __importDefault(require("cookie-session"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var body_parser_1 = __importDefault(require("body-parser"));
var connect_flash_1 = __importDefault(require("connect-flash"));
database_1.AppDataSource.initialize().then(function () {
    var server = (0, express_1.default)();
    var localHost = 'http://localhost';
    var port = 5000;
    var __dirname = path_1.default.resolve();
    server.set('trust proxy', 1);
    server.set('view engine', 'ejs');
    server.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
    server.use((0, cookie_session_1.default)({
        name: 'session_app',
        secret: process.env.COOKIE_SECRET,
        keys: [process.env.COOKIE_SECRET],
        sameSite: 'strict',
        secure: process.env.COOKIE_SECRET === 'production' ? true : false,
        httpOnly: true
    }));
    server.use((0, connect_flash_1.default)());
    server.use(body_parser_1.default.urlencoded({ extended: true }));
    server.use(body_parser_1.default.json());
    server.use(body_parser_1.default.text({ type: 'text/json' }));
    server.use((0, cors_1.default)());
    server.use(express_1.default.static(__dirname + '/src/views'));
    server.use(express_1.default.static(__dirname + '/src/public'));
    server.use(express_1.default.static(__dirname + '/dist'));
    server.use(register_login_route_1.default);
    server.use(dashboard_route_1.default);
    server.use(administration_route_1.default);
    return server.listen(process.env.PORT || port, function () {
        if (process.env.NODE_ENV === 'production') {
            console.log('Servidor rodando remotamente no Heroku !');
        }
        else {
            console.log("Servidor rodando localmente em ".concat(localHost, ":").concat(port));
        }
    });
});
