import { Router } from "express";
import { authenticate, authorize } from '../middlewares/authMiddleware';
import  ReserveController from "../controllers/reserveController";
import { authorizeCreateReserve, authorizeDeleteReserve } from "../utils/authorization";

export const reserveRoutes = Router();


reserveRoutes.post("/",
    authenticate, 
    authorize(['comum', 'admin', 'master', 'ultra'], authorizeCreateReserve),
    (req, res) => ReserveController.createReserve(req, res));

reserveRoutes.get("/workspace/:id", authenticate, (req, res) => ReserveController.getReservesByWorkspace(req, res));

reserveRoutes.get("/user/:user_id", authenticate, (req, res) => ReserveController.getReservesByUser(req, res));

reserveRoutes.get("/:id", authenticate, (req, res) => ReserveController.getOneReserve(req, res));

reserveRoutes.delete("/:id", 
    authenticate, 
    authorize(['comum', 'admin', 'master', 'ultra'], authorizeDeleteReserve),
    (req, res) => ReserveController.deleteOneReserve(req, res));
