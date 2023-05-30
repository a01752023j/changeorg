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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractController_1 = __importDefault(require("./AbstractController"));
const models_1 = __importDefault(require("../models")); //BD relacional
class AuthenticationController extends AbstractController_1.default {
    validateBody(type) {
        throw new Error("Method not implemented.");
    }
    static getInstance() {
        if (this.instance)
            return this.instance;
        this.instance = new AuthenticationController("creador");
        return this.instance;
    }
    initRoutes() {
        this.router.post("/signup", this.signup.bind(this));
        this.router.post("/verificar", this.verify.bind(this));
        this.router.post("/signin", this.signin.bind(this));
        this.router.get("/test", this.authMiddleware.verifyToken, this.test.bind(this));
        this.router.get("/testTokenRole", this.authMiddleware.verifyToken, this.testTokenRole.bind(this));
    }
    testTokenRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res
                .status(200)
                .send("Esto es una prueba de verificación de token y Role")
                .end();
        });
    }
    test(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).send("Esto es una prueba de verificación").end();
        });
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const login = yield this.cognitoService.signInUser(email, password);
                res.status(200).send(Object.assign({}, login.AuthenticationResult));
            }
            catch (error) {
                res.status(500).send({ code: error.code, message: error.message });
            }
        });
    }
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, code } = req.body;
            try {
                yield this.cognitoService.verifyUser(email, code);
                return res.status(200).send({ message: "Correct verification" });
            }
            catch (error) {
                res.status(500).send({ code: error.code, message: error.message });
            }
        });
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, name, monto, proposito, meta } = req.body;
            try {
                //Create el usuario de cognito
                const user = yield this.cognitoService.signUpUser(email, password, [
                    {
                        Name: "email",
                        Value: email,
                    },
                ]);
                console.log("cognito user created", user);
                //Creación del usuario dentro de RDS-MySQL
                yield models_1.default["User"].create({
                    awsCognitoId: user.UserSub,
                    name,
                    monto,
                    proposito,
                    meta,
                    email,
                });
                res.status(201).send({ message: "User signedUp" });
            }
            catch (error) {
                res.status(500).send({ code: error.code, message: error.message });
            }
        });
    }
}
exports.default = AuthenticationController;
