import { Router } from "express";
import  UserController from "../controllers/userController";

export const userRoutes = Router();


userRoutes.get("/", (req, res) => UserController.getAllUsers(req, res));

userRoutes.post("/", (req, res) => UserController.createUser(req, res));

userRoutes.get("/:id", (req, res) => UserController.getOneUser(req, res));

userRoutes.put("/:id", (req, res) => UserController.editOneUser(req, res));

userRoutes.delete("/:id", (req, res) => UserController.deleteOneUser(req, res));
