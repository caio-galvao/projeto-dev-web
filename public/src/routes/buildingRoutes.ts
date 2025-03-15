import { Router } from "express";
import { authenticate, authorize } from '../middlewares/authMiddleware';
import  BuildingController from "../controllers/buildingController";

export const buildingRoutes = Router();


buildingRoutes.post("/", authenticate, authorize(['master', 'ultra']), (req, res) => BuildingController.createBuilding(req, res));

buildingRoutes.get("/company/:company_id", authenticate, authorize(['admin', 'master', 'ultra']), (req, res) => BuildingController.getBuildingByCompany(req, res));

buildingRoutes.get("/:id", authenticate, (req, res) => BuildingController.getOneBuilding(req, res));

buildingRoutes.put("/:id", authenticate, authorize(['master', 'ultra']), (req, res) => BuildingController.editOneBuilding(req, res));

buildingRoutes.delete("/:id", authenticate, authorize(['master', 'ultra']), (req, res) => BuildingController.deleteOneBuilding(req, res));
