import { Router } from "express";
import { authenticate, authorize } from '../middlewares/authMiddleware';
import  WorkspaceController from "../controllers/workspaceController";
import { authorizeByWorkspaceId } from "../utils/authorization";

export const workspaceRoutes = Router();


workspaceRoutes.get("/room/:room_id", authenticate, (req, res) => WorkspaceController.getWorkspacesByRoom(req, res));

workspaceRoutes.get("/:id", authenticate, (req, res) => WorkspaceController.getOneWorkspace(req, res));

workspaceRoutes.put("/:id", 
    authenticate, 
    authorize(["admin", "master", "ultra"], authorizeByWorkspaceId),
    (req, res) => WorkspaceController.editOneWorkspace(req, res));