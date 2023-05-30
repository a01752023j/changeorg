"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = __importDefault(require("./providers/Server"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
const AuthenticationController_1 = __importDefault(require("./controllers/AuthenticationController"));
const RecaudacionController_1 = __importDefault(require("./controllers/RecaudacionController"));
const servidor = new Server_1.default({
    port: 8080,
    middlewares: [
        express_1.default.json(),
        express_1.default.urlencoded({ extended: true }),
        (0, cors_1.default)()
    ],
    controllers: [
        UserController_1.default.getInstance(),
        RecaudacionController_1.default.getInstance(),
        AuthenticationController_1.default.getInstance()
    ],
    env: 'development'
});
servidor.init();
