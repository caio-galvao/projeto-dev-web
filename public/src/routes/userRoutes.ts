import { Router } from "express";
import  UserController from "../controllers/userController";

export const userRoutes = Router();

userRoutes.get("/", (req, res) => UserController.getAllUsers(req, res));
userRoutes.post("/", (req, res) => UserController.createUser(req, res));