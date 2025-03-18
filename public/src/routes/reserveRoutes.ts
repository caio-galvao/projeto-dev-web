import { Router } from "express";
import { authenticate } from '../middlewares/authMiddleware';
import  ReserveController from "../controllers/reserveController";

export const reserveRoutes = Router();


reserveRoutes.post("/", authenticate, (req, res) => ReserveController.createReserve(req, res));

reserveRoutes.get("/workspace/:workspace_id", authenticate, (req, res) => ReserveController.getReservesByWorkspace(req, res));

reserveRoutes.get("/user/:user_id", authenticate, (req, res) => ReserveController.getReservesByUser(req, res));

reserveRoutes.get("/:id", authenticate, (req, res) => ReserveController.getOneReserve(req, res));

reserveRoutes.delete("/:id", authenticate, (req, res) => ReserveController.deleteOneReserve(req, res));
