import { Router } from "express";
import { authenticate, authorize } from '../middlewares/authMiddleware';
import RoomController from "../controllers/roomController";

export const roomRoutes = Router();


roomRoutes.post("/", authenticate, authorize(['master', 'ultra']), (req, res) => RoomController.createRoom(req, res));

roomRoutes.get("/building/:building_id", authorize(['admin', 'master', 'ultra']), authenticate, (req, res) => RoomController.getRoomsByBuilding(req, res));

roomRoutes.get("/user/:manager_id", authenticate, authorize(['admin', 'master', 'ultra']), (req, res) => RoomController.getRoomsByManager(req, res));

roomRoutes.get("/:id", authenticate, (req, res) => RoomController.getOneRoom(req, res));

roomRoutes.put("/:id", authenticate, authorize(['admin', 'master', 'ultra']), (req, res) => RoomController.editOneRoom(req, res));

roomRoutes.delete("/:id", authenticate, authorize(['master', 'ultra']), (req, res) => RoomController.deleteOneRoom(req, res));
