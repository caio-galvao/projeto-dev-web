import { Router } from "express";
import { authenticate } from '../middlewares/authMiddleware';
import  BuildingController from "../controllers/buildingController";

export const buildingRoutes = Router();


buildingRoutes.post("/", authenticate, (req, res) => BuildingController.createBuilding(req, res));

buildingRoutes.get("/company/:company_id", authenticate, (req, res) => BuildingController.getBuildingByCompany(req, res));

buildingRoutes.get("/:id", authenticate, (req, res) => BuildingController.getOneBuilding(req, res));

buildingRoutes.put("/:id", authenticate, (req, res) => BuildingController.editOneBuilding(req, res));

buildingRoutes.delete("/:id", authenticate, (req, res) => BuildingController.deleteOneBuilding(req, res));
