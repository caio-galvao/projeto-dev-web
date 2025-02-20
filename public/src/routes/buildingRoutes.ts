import { Router } from "express";
import  BuildingController from "../controllers/buildingController";

export const buildingRoutes = Router();


buildingRoutes.post("/", (req, res) => BuildingController.createBuilding(req, res));

buildingRoutes.get("/company/:company_id", (req, res) => BuildingController.getBuildingByCompany(req, res));

buildingRoutes.get("/:id", (req, res) => BuildingController.getOneBuilding(req, res));

buildingRoutes.put("/:id", (req, res) => BuildingController.editOneBuilding(req, res));

buildingRoutes.delete("/:id", (req, res) => BuildingController.deleteOneBuilding(req, res));
