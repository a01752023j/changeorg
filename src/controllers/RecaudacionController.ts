import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

class RecaudacionController extends AbstractController {
  protected validateBody(type: any) {
    throw new Error("Method not implemented.");
  }

  //Singleton
  private static instance: RecaudacionController;
  public static getInstance(): AbstractController {
    //Busca la intancia
    if (this.instance) {
      return this.instance;
    }
    //Si no existe, crea una
    this.instance = new RecaudacionController("recaudacion");
    return this.instance;
  }

  //Configurar las rutas del controlador
  protected initRoutes(): void {
    this.router.post(
      "/donacion",
      this.authMiddleware.verifyToken,
      this.donacion.bind(this)
    );
    this.router.post(
      "/configurar",
      this.authMiddleware.verifyToken,
      this.configurar.bind(this)
    );
    this.router.get(
      "/totalDonaciones",
      this.authMiddleware.verifyToken,
      this.totalDonaciones.bind(this)
    );
  }

  async donacion(req: Request, res: Response) {
    const { email, creador, donacion } = req.body;
    try {
      await db["User"].increment("monto", {
        by: donacion,
        where: { name: creador },
      });

      return res.status(200).send({
        message: `Donacion recibida ❤️: ${creador} recibio ${donacion}`,
      }).end();
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
    }
  }

  async configurar(req: Request, res: Response) {
    const { email, proposito, meta } = req.body;
    try {
      await db["User"].update(
        { proposito: proposito, meta: meta },
        {
          where: {
            email: email,
          },
        }
      );

      return res.status(200).send({ message: `Actualizacion recibida 🖖` });
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
    }
  }

  async totalDonaciones(req: Request, res: Response) {
    const { creador } = req.body;
    const monto = await db["User"].findOne({
      attributes: ["monto"],
      where: { name: creador },
    });
    const meta = await db["User"].findOne({
      attributes: ["meta"],
      where: { name: creador },
    });
    res.status(200).send(`Monto total recaudado: ${monto.dataValues.monto} de ${meta.dataValues.meta}`);
  }
}

export default RecaudacionController;
