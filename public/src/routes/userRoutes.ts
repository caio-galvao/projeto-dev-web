import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

router.get("/user", UserController.getAllUsers);
router.post("/user", UserController.createUser);

export default router;