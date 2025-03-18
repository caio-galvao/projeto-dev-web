import { Router } from "express";
import { authenticate } from '../middlewares/authMiddleware';
import RoomController from "../controllers/roomController";

export const roomRoutes = Router();


roomRoutes.post("/", authenticate, (req, res) => RoomController.createRoom(req, res));

roomRoutes.get("/building/:building_id", authenticate, (req, res) => RoomController.getRoomsByBuilding(req, res));

roomRoutes.get("/user/:manager_id", authenticate, (req, res) => RoomController.getRoomsByManager(req, res));

roomRoutes.get("/:id", authenticate, (req, res) => RoomController.getOneRoom(req, res));

roomRoutes.put("/:id", authenticate, (req, res) => RoomController.editOneRoom(req, res));

roomRoutes.delete("/:id", authenticate, (req, res) => RoomController.deleteOneRoom(req, res));
