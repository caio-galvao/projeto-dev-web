import { Router } from "express";
import RoomController from "../controllers/roomController";

export const roomRoutes = Router();


roomRoutes.post("/", (req, res) => RoomController.createRoom(req, res));

roomRoutes.get("/building/:building_id", (req, res) => RoomController.getRoomsByBuilding(req, res));

roomRoutes.get("/user/:manager_id", (req, res) => RoomController.getRoomsByManager(req, res));

roomRoutes.get("/:id", (req, res) => RoomController.getOneRoom(req, res));

roomRoutes.put("/:id", (req, res) => RoomController.editOneRoom(req, res));

roomRoutes.delete("/:id", (req, res) => RoomController.deleteOneRoom(req, res));

// roomRoutes.get("/:id/user", (req, res) => RoomController.getUsersByRoom(req, res));
