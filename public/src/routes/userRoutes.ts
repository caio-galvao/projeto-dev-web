import { Router } from "express";
import { authenticate, authorize } from '../middlewares/authMiddleware';
import  UserController from "../controllers/userController";

export const userRoutes = Router();


userRoutes.get("/", authenticate, authorize(['ultra']), (req, res) => UserController.getAllUsers(req, res));

userRoutes.post("/", (req, res) => UserController.createUser(req, res));

userRoutes.get("/:id", authenticate, (req, res) => UserController.getOneUser(req, res));

userRoutes.put("/:id", 
    authenticate, 
    authorize(["comum", "admin", "master", "ultra"], async (req, user) => {
        if (user.role != "ultra") {
            return req.params.id === user.id;
        }
        return true;
    }),
    (req, res) => UserController.editOneUser(req, res));

userRoutes.delete("/:id",
    authenticate,
    authorize(["comum", "admin", "master", "ultra"], async (req, user) => {
        if (user.role != "ultra") {
            return req.params.id === user.id;
        }
        return true;
    }),
    (req, res) => UserController.deleteOneUser(req, res));
