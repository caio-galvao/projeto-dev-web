import { Router } from "express";
import  CompanyController from "../controllers/companyController";

export const companyRoutes = Router();


companyRoutes.get("/", (req, res) => CompanyController.getAllCompanies(req, res));

companyRoutes.post("/", (req, res) => CompanyController.createCompany(req, res));

companyRoutes.get("/:id", (req, res) => CompanyController.getOneCompany(req, res));

companyRoutes.put("/:id", (req, res) => CompanyController.editOneCompany(req, res));

companyRoutes.delete("/:id", (req, res) => CompanyController.deleteOneCompany(req, res));
