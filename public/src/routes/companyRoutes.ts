import { Router } from "express";
import { authenticate, authorize } from '../middlewares/authMiddleware';
import  CompanyController from "../controllers/companyController";
import { CompanyService } from "../services/companyService";

export const companyRoutes = Router();
const companyService = new CompanyService();


companyRoutes.get("/", authenticate, authorize(['ultra']), (req, res) => CompanyController.getAllCompanies(req, res));

companyRoutes.post("/", authenticate, authorize(['master', 'ultra']), (req, res) => CompanyController.createCompany(req, res));

companyRoutes.get("/:id", authenticate, (req, res) => CompanyController.getOneCompany(req, res));

companyRoutes.put("/:id", 
    authenticate, 
    authorize(['master', 'ultra'], async (req, user) => {
        if (user.role != "ultra") {
            const company = await companyService.getOneCompany(Number(req.params.id));
            return company ? company.manager_id === user.id: false;
        }
        return true;
    }),
    (req, res) => CompanyController.editOneCompany(req, res));

companyRoutes.delete("/:id", 
    authenticate, 
    authorize(['master', 'ultra'], async (req, user) => {
        if (user.role != "ultra") {
            const company = await companyService.getOneCompany(Number(req.params.id));
            return company ? company.manager_id === user.id: false;
        }
        return true;
    }),
    (req, res) => CompanyController.deleteOneCompany(req, res));
