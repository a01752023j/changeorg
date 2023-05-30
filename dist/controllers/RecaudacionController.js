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
const models_1 = __importDefault(require("../models"));
class RecaudacionController extends AbstractController_1.default {
    validateBody(type) {
        throw new Error("Method not implemented.");
    }
    static getInstance() {
        //Busca la intancia
        if (this.instance) {
            return this.instance;
        }
        //Si no existe, crea una
        this.instance = new RecaudacionController("recaudacion");
        return this.instance;
    }
    //Configurar las rutas del controlador
    initRoutes() {
        this.router.post("/donacion", this.authMiddleware.verifyToken, this.donacion.bind(this));
        this.router.post("/configurar", this.authMiddleware.verifyToken, this.configurar.bind(this));
        this.router.get("/totalDonaciones", this.authMiddleware.verifyToken, this.totalDonaciones.bind(this));
    }
    donacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, creador, donacion } = req.body;
            try {
                yield models_1.default["User"].increment("monto", {
                    by: donacion,
                    where: { name: creador },
                });
                return res.status(200).send({
                    message: `Donacion recibida ❤️: ${creador} recibio ${donacion}`,
                }).end();
            }
            catch (error) {
                res.status(500).send({ code: error.code, message: error.message });
            }
        });
    }
    configurar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, proposito, meta } = req.body;
            try {
                yield models_1.default["User"].update({ proposito: proposito, meta: meta }, {
                    where: {
                        email: email,
                    },
                });
                return res.status(200).send({ message: `Actualizacion recibida 🖖` });
            }
            catch (error) {
                res.status(500).send({ code: error.code, message: error.message });
            }
        });
    }
    totalDonaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { creador } = req.body;
            const monto = yield models_1.default["User"].findOne({
                attributes: ["monto"],
                where: { name: creador },
            });
            const meta = yield models_1.default["User"].findOne({
                attributes: ["meta"],
                where: { name: creador },
            });
            res.status(200).send(`Monto total recaudado: ${monto.dataValues.monto} de ${meta.dataValues.meta}`);
        });
    }
}
exports.default = RecaudacionController;
