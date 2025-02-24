import { Router } from "express";
import  WorkspaceController from "../controllers/workspaceController";

export const workspaceRoutes = Router();


workspaceRoutes.get("/room/:room_id", (req, res) => WorkspaceController.getWorkspacesByRoom(req, res));

workspaceRoutes.get("/:id", (req, res) => WorkspaceController.getOneWorkspace(req, res));

workspaceRoutes.put("/:id", (req, res) => WorkspaceController.editOneWorkspace(req, res));