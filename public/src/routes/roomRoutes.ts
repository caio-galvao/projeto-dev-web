import { Router } from "express";
import RoomController from "../controllers/roomController";

export const roomRoutes = Router();


// roomRoutes.get("/", (req, res) => RoomController.getAllRooms(req, res));

roomRoutes.post("/", (req, res) => RoomController.createRoom(req, res));

// roomRoutes.get("/:id", (req, res) => RoomController.getOneRoom(req, res));

// roomRoutes.put("/:id", (req, res) => RoomController.editOneRoom(req, res));

// roomRoutes.delete("/:id", (req, res) => RoomController.deleteOneRoom(req, res));
