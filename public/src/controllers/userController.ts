import { UserService } from "../services/userService";
import { Request, Response } from "express"

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    //app.post("/user", async (req, res) =>

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { id, name, password, type } = req.body;
            const user = await this.userService.createUser(id, name, password, type);
            res.json(user); // Retorna o usuário criado
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao criar o usuário", error: error.message });
    }
    };

    //app.get("/user", async (req, res) => 
        
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();
            res.json(users); // Retorna todos os usuários
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao obter os usuários", error: error.message });
        }
    };
}

export default new UserController();