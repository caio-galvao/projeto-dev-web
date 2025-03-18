import { Router } from "express";
import { authenticate, authorize } from '../middlewares/authMiddleware';
import RoomController from "../controllers/roomController";
import { authorizeByBuildingIdInBody, authorizeByRoomId, authorizeByRoomUser } from "../utils/authorization";

export const roomRoutes = Router();


roomRoutes.post("/", 
    authenticate, 
    authorize(['master', 'ultra'], authorizeByBuildingIdInBody),
    (req, res) => RoomController.createRoom(req, res));

roomRoutes.get("/building/:building_id", authorize(['admin', 'master', 'ultra']), authenticate, (req, res) => RoomController.getRoomsByBuilding(req, res));

roomRoutes.get("/manager/:manager_id", authenticate, authorize(['admin', 'master', 'ultra']), (req, res) => RoomController.getRoomsByManager(req, res));

roomRoutes.get("/:id", authenticate, (req, res) => RoomController.getOneRoom(req, res));

roomRoutes.put("/:id",
    authenticate,
    authorize(["admin", "master", "ultra"], authorizeByRoomId),
    (req, res) => RoomController.editOneRoom(req, res)
);

roomRoutes.delete("/:id", 
    authenticate, 
    authorize(['master', 'ultra'], authorizeByRoomId),
    (req, res) => RoomController.deleteOneRoom(req, res));

roomRoutes.get("/user/:room_id", authenticate, authorize(['admin', 'master', 'ultra']), (req, res) => RoomController.getUsersByRoom(req, res));

roomRoutes.post("/:room_id/user/:user_id", 
    authenticate, 
    authorize(['admin', 'master', 'ultra'], authorizeByRoomUser),
    (req, res) => RoomController.addUserInRoom(req, res));

roomRoutes.delete("/:room_id/user/:user_id", 
    authenticate, 
    authorize(['admin', 'master', 'ultra'], authorizeByRoomUser),
    (req, res) => RoomController.deleteUserFromRoom(req, res));