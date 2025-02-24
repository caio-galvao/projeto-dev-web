import { Router } from "express";
import  ReserveController from "../controllers/reserveController";

export const reserveRoutes = Router();


reserveRoutes.post("/", (req, res) => ReserveController.createReserve(req, res));

reserveRoutes.get("/workspace/:workspace_id", (req, res) => ReserveController.getReservesByWorkspace(req, res));

reserveRoutes.get("/user/:user_id", (req, res) => ReserveController.getReservesByUser(req, res));

reserveRoutes.get("/:id", (req, res) => ReserveController.getOneReserve(req, res));

reserveRoutes.delete("/:id", (req, res) => ReserveController.deleteOneReserve(req, res));
