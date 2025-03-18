import { UserService } from "../services/userService";
import { Request, Response } from "express"

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { id, name, password, type } = req.body;

            if (!id || !name || !password || !type) {
                res.status(400).json({ message: "Dados inválidos. Todos os campos são obrigatórios." });
                return
            }
    
            if (id.length !== 14) {
                res.status(400).json({ message: "O campo CPF deve ter exatamente 14 caracteres." });
                return
            }
    
            const user = await this.userService.createUser(id, name, password, type);

            if(!user) {
                res.status(409).json({ message: "Um usuário com este CPF já existe." });
                return;
            }

            res.status(201).json(user); // Retorna o usuário criado
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao criar o usuário", error: error.message });
    }
    };
        
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();

            if (!users) {
                res.status(204).json({ message: "Não há usuários resgistrados" });
                return;
            }

            res.json(users);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao obter os usuários", error: error.message });
        }
    };
        
    async getOneUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params; 
            const user = await this.userService.getOneUser(id);
    
            if (!user) {
                res.status(404).json({ message: "Usuário não encontrado" });
                return;
            }
    
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao obter o usuário", error: error.message });
        }
    };

    async editOneUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, password, type } = req.body;

            if (!id || !name || !password || !type) {
                res.status(400).json({ message: "Dados inválidos. Todos os campos são obrigatórios." });
                return
            }
    
            if (id.length !== 14) {
                res.status(400).json({ message: "O campo CPF deve ter exatamente 14 caracteres." });
                return
            }
    
            const user = await this.userService.editOneUser(id, name, password, type);

            if(!user) {
                res.status(404).json({ message: "Usuário não encontrado." });
                return;
            }

            res.status(201).json(user);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao editar o usuário", error: error.message });
    }
    };
        
    async deleteOneUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params; 
            const user = await this.userService.deleteOneUser(id);
    
            if (!user) {
                res.status(404).json({ message: "Usuário não encontrado" });
                return;
            }
    
            res.status(204).json(user);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao remover o usuário", error: error.message });
        }
    };
}

export default new UserController();
