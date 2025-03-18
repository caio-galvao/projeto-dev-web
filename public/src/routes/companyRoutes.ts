import { Router } from "express";
import { authenticate } from '../middlewares/authMiddleware';
import  CompanyController from "../controllers/companyController";

export const companyRoutes = Router();


companyRoutes.get("/", authenticate, (req, res) => CompanyController.getAllCompanies(req, res));

companyRoutes.post("/", authenticate, (req, res) => CompanyController.createCompany(req, res));

companyRoutes.get("/:id", authenticate, (req, res) => CompanyController.getOneCompany(req, res));

companyRoutes.put("/:id", authenticate, (req, res) => CompanyController.editOneCompany(req, res));

companyRoutes.delete("/:id", authenticate, (req, res) => CompanyController.deleteOneCompany(req, res));
