import { Router } from "express";
import { authenticate, authorize } from '../middlewares/authMiddleware';
import RoomController from "../controllers/roomController";
import { RoomService } from "../services/roomService";

export const roomRoutes = Router();
const roomService = new RoomService();


roomRoutes.post("/", authenticate, authorize(['master', 'ultra']), (req, res) => RoomController.createRoom(req, res));

roomRoutes.get("/building/:building_id", authorize(['admin', 'master', 'ultra']), authenticate, (req, res) => RoomController.getRoomsByBuilding(req, res));

roomRoutes.get("/user/:manager_id", authenticate, authorize(['admin', 'master', 'ultra']), (req, res) => RoomController.getRoomsByManager(req, res));

roomRoutes.get("/:id", authenticate, (req, res) => RoomController.getOneRoom(req, res));

roomRoutes.put("/:id",
    authenticate,
    authorize(["admin", "master", "ultra"], async (req, user) => {
        if (user.role === "admin") {
            const room = await roomService.getOneRoom(Number(req.params.id));
            return room ? room.manager_id === user.id : false; // Ensure the admin is the manager
        }
        return true; // "master" and "ultra" roles are allowed without additional checks
    }),
    (req, res) => RoomController.editOneRoom(req, res)
);

roomRoutes.put("/:id", authenticate, authorize(['admin', 'master', 'ultra']), (req, res) => RoomController.editOneRoom(req, res));

roomRoutes.delete("/:id", authenticate, authorize(['master', 'ultra']), (req, res) => RoomController.deleteOneRoom(req, res));
