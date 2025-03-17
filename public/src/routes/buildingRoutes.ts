import { Router } from "express";
import { authenticate, authorize } from '../middlewares/authMiddleware';
import  BuildingController from "../controllers/buildingController";
import { BuildingService } from "../services/buildingService";
import { CompanyService } from "../services/companyService";

export const buildingRoutes = Router();
const buildingService = new BuildingService();
const companyService = new CompanyService();


buildingRoutes.post("/", authenticate, authorize(['master', 'ultra']), (req, res) => BuildingController.createBuilding(req, res));

buildingRoutes.get("/company/:company_id", authenticate, authorize(['admin', 'master', 'ultra']), (req, res) => BuildingController.getBuildingByCompany(req, res));

buildingRoutes.get("/:id", authenticate, (req, res) => BuildingController.getOneBuilding(req, res));

buildingRoutes.put("/:id", 
    authenticate, 
    authorize(['master', 'ultra'], async (req, user) => {
        if (user.role != "ultra") {
            const building = await buildingService.getOneBuilding(Number(req.params.id));
            const company = await companyService.getOneCompany(Number(building?.company_id));
            return company ? company.manager_id === user.id: false;
        }
        return true;
    }),
    (req, res) => BuildingController.editOneBuilding(req, res));

buildingRoutes.delete("/:id", 
    authenticate, 
    authorize(['master', 'ultra'], async (req, user) => {
        if (user.role != "ultra") {
            const building = await buildingService.getOneBuilding(Number(req.params.id));
            const company = await companyService.getOneCompany(Number(building?.company_id));
            return company ? company.manager_id === user.id: false;
        }
        return true;
    }),
    (req, res) => BuildingController.deleteOneBuilding(req, res));
