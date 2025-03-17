import { Router } from "express";
import { authenticate, authorize } from '../middlewares/authMiddleware';
import  WorkspaceController from "../controllers/workspaceController";
import { WorkspaceService } from "../services/workspaceService";
import { RoomService } from "../services/roomService";
import { BuildingService } from "../services/buildingService";
import { CompanyService } from "../services/companyService";

export const workspaceRoutes = Router();
const workspaceService = new WorkspaceService();
const roomService = new RoomService();
const buildingService = new BuildingService();
const companyService = new CompanyService();


workspaceRoutes.get("/room/:room_id", authenticate, (req, res) => WorkspaceController.getWorkspacesByRoom(req, res));

workspaceRoutes.get("/:id", authenticate, (req, res) => WorkspaceController.getOneWorkspace(req, res));

workspaceRoutes.put("/:id", 
    authenticate, 
    authorize(["admin", "master", "ultra"], async (req, user) => {
        if (user.role === "admin") {
            const workspace = await workspaceService.getOneWorkspace(Number(req.params.id))
            const room = await roomService.getOneRoom(Number(workspace?.room_id));
            return room ? room.manager_id === user.id : false;
        }
        if (user.role === "master") {
            const workspace = await workspaceService.getOneWorkspace(Number(req.params.id))
            const room = await roomService.getOneRoom(Number(workspace?.room_id));
            const building = await buildingService.getOneBuilding(Number(room?.building_id))
            const company = await companyService.getOneCompany(Number(building?.company_id))
            return company ? company.manager_id === user.id : false;
        };
        return true;
    }),
    (req, res) => WorkspaceController.editOneWorkspace(req, res));