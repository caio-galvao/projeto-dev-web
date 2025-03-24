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

            if (!id) {
                res.status(400).json({ message: "O campo CPF é obrigatório." });
                return;
            }
            if (!name) {
                res.status(400).json({ message: "O campo nome é obrigatório." });
                return;
            }
            if (!password) {
                res.status(400).json({ message: "O campo senha é obrigatório." });
                return;
            }
            if (!type) {
                res.status(400).json({ message: "O campo tipo é obrigatório." });
                return;
            }

            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
            if (!cpfRegex.test(id)) {
                res.status(400).json({ message: "O campo CPF deve estar no formato XXX.XXX.XXX-XX." });
                return;
            }

            const user = await this.userService.createUser(id, name, password, type);

            if (!user) {
                res.status(409).json({ message: "Um usuário com este CPF já existe." });
                return;
            }

            res.status(201).json(user);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao criar o usuário", error: error.message });
        }
    };

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();

            if (!users) {
                res.status(204).json({ message: "Não há usuários resgistrados." });
                return;
            }

            res.json(users);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao obter os usuários.", error: error.message });
        }
    };

    async getOneUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: "O campo CPF é obrigatório." });
                return;
            }
            
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
            if (!cpfRegex.test(id)) {
                res.status(400).json({ message: "O campo CPF deve estar no formato XXX.XXX.XXX-XX." });
                return;
            }
            
            const user = await this.userService.getOneUser(id);

            if (!user) {
                res.status(404).json({ message: "Usuário não encontrado." });
                return;
            }
    
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao obter o usuário.", error: error.message });
        }
    };

    async editOneUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, password, type } = req.body;

            if (!id) {
                res.status(400).json({ message: "O campo CPF é obrigatório." });
                return;
            }          
            
            if (!name) {
                res.status(400).json({ message: "O campo nome é obrigatório." });
                return;
            }
            if (!password) {
                res.status(400).json({ message: "O campo senha é obrigatório." });
                return;
            }
            if (!type) {
                res.status(400).json({ message: "O campo tipo é obrigatório." });
                return;
            }
            
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
            if (!cpfRegex.test(id)) {
                res.status(400).json({ message: "O campo CPF deve estar no formato XXX.XXX.XXX-XX." });
                return;
            }

            const user = await this.userService.editOneUser(id, name, password, type);

            if (!user) {
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

            if (!id) {
                res.status(400).json({ message: "O campo CPF é obrigatório." });
                return;
            }  

            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
            if (!cpfRegex.test(id)) {
                res.status(400).json({ message: "O campo CPF deve estar no formato XXX.XXX.XXX-XX." });
                return;
            }
            
            const user = await this.userService.deleteOneUser(id);
    
            if (!user) {
                res.status(404).json({ message: "Usuário não encontrado." });
                return;
            }
    
            res.status(204).json(user);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao remover o usuário.", error: error.message });
        }
    };
}

export default new UserController();
