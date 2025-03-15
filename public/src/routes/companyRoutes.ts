import { Router } from "express";
import { authenticate, authorize } from '../middlewares/authMiddleware';
import  CompanyController from "../controllers/companyController";

export const companyRoutes = Router();


companyRoutes.get("/", authenticate, authorize(['ultra']), (req, res) => CompanyController.getAllCompanies(req, res));

companyRoutes.post("/", authenticate, authorize(['master', 'ultra']), (req, res) => CompanyController.createCompany(req, res));

companyRoutes.get("/:id", authenticate, (req, res) => CompanyController.getOneCompany(req, res));

companyRoutes.put("/:id", authenticate, authorize(['master', 'ultra']), (req, res) => CompanyController.editOneCompany(req, res));

companyRoutes.delete("/:id", authenticate, authorize(['master', 'ultra']), (req, res) => CompanyController.deleteOneCompany(req, res));
