import { Router } from "express";
import { authenticate, authorize } from '../middlewares/authMiddleware';
import RoomController from "../controllers/roomController";
import { RoomService } from "../services/roomService";
import { BuildingService } from "../services/buildingService";
import { CompanyService } from "../services/companyService";

export const roomRoutes = Router();
const roomService = new RoomService();
const buildingService = new BuildingService();
const companyService = new CompanyService();


roomRoutes.post("/", 
    authenticate, 
    authorize(['master', 'ultra'], async (req, user) => {
        if (user.role === "master") {
            const { building_id } = req.body;
            const building = await buildingService.getOneBuilding(Number(building_id))
            const company = await companyService.getOneCompany(Number(building?.company_id))
            return company ? company.manager_id === user.id : false;
        };
        return true
    }),
    (req, res) => RoomController.createRoom(req, res));

roomRoutes.get("/building/:building_id", authorize(['admin', 'master', 'ultra']), authenticate, (req, res) => RoomController.getRoomsByBuilding(req, res));

roomRoutes.get("/manager/:manager_id", authenticate, authorize(['admin', 'master', 'ultra']), (req, res) => RoomController.getRoomsByManager(req, res));

roomRoutes.get("/:id", authenticate, (req, res) => RoomController.getOneRoom(req, res));

roomRoutes.put("/:id",
    authenticate,
    authorize(["admin", "master", "ultra"], async (req, user) => {
        if (user.role === "admin") {
            const room = await roomService.getOneRoom(Number(req.params.id));
            return room ? room.manager_id === user.id : false;
        }
        if (user.role === "master") {
            const room = await roomService.getOneRoom(Number(req.params.id));
            const building = await buildingService.getOneBuilding(Number(room?.building_id))
            const company = await companyService.getOneCompany(Number(building?.company_id))
            return company ? company.manager_id === user.id : false;
        };
        return true;
    }),
    (req, res) => RoomController.editOneRoom(req, res)
);

roomRoutes.delete("/:id", 
    authenticate, 
    authorize(['master', 'ultra'], async (req, user) => {
        if (user.role === "master") {
            const room = await roomService.getOneRoom(Number(req.params.id));
            const building = await buildingService.getOneBuilding(Number(room?.building_id))
            const company = await companyService.getOneCompany(Number(building?.company_id))
            return company ? company.manager_id === user.id : false;
        };
        return true;
    }),
    (req, res) => RoomController.deleteOneRoom(req, res));

roomRoutes.get("/user/:room_id", authenticate, authorize(['admin', 'master', 'ultra']), (req, res) => RoomController.getUsersByRoom(req, res));

roomRoutes.post("/:room_id/user/:user_id", 
    authenticate, 
    authorize(['admin', 'master', 'ultra'], async (req, user) => {
        if (user.role === "admin") {
            const room = await roomService.getOneRoom(Number(req.params.room_id));
            return room ? room.manager_id === user.id : false;
        }
        if (user.role === "master") {
            const room = await roomService.getOneRoom(Number(req.params.room_id));
            const building = await buildingService.getOneBuilding(Number(room?.building_id))
            const company = await companyService.getOneCompany(Number(building?.company_id))
            return company ? company.manager_id === user.id : false;
        };
        return true;
    }),
    (req, res) => RoomController.addUserInRoom(req, res));

roomRoutes.delete("/:room_id/user/:user_id", 
    authenticate, 
    authorize(['admin', 'master', 'ultra'], async (req, user) => {
        if (user.role === "admin") {
            const room = await roomService.getOneRoom(Number(req.params.room_id));
            return room ? room.manager_id === user.id : false;
        }
        if (user.role === "master") {
            const room = await roomService.getOneRoom(Number(req.params.room_id));
            const building = await buildingService.getOneBuilding(Number(room?.building_id))
            const company = await companyService.getOneCompany(Number(building?.company_id))
            return company ? company.manager_id === user.id : false;
        };
        return true;
    }),
    (req, res) => RoomController.deleteUserFromRoom(req, res));