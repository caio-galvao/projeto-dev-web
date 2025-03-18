import { Router } from "express";
import { authenticate } from '../middlewares/authMiddleware';
import  UserController from "../controllers/userController";

export const userRoutes = Router();


userRoutes.get("/", authenticate, (req, res) => UserController.getAllUsers(req, res));

userRoutes.post("/", (req, res) => UserController.createUser(req, res));

userRoutes.get("/:id", authenticate, (req, res) => UserController.getOneUser(req, res));

userRoutes.put("/:id", authenticate, (req, res) => UserController.editOneUser(req, res));

userRoutes.delete("/:id", authenticate, (req, res) => UserController.deleteOneUser(req, res));
