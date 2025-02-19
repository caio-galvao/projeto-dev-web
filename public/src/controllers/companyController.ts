import { CompanyService } from "../services/companyService";
import { Request, Response } from "express"

export class UserController {
    private companyService: CompanyService;

    constructor() {
        this.companyService = new CompanyService();
    }

    async createCompany(req: Request, res: Response): Promise<void> {
        try {
            const { id, name, password, type } = req.body;

            if (!id || !name || !password || !type) {
                res.status(400).json({ message: "Dados inválidos. Todos os campos são obrigatórios." });
                return
            }
    
            const user = await this.companyService.createCompany(id, name, password, type);

            if(!user) {
                res.status(409).json({ message: "Uma empresa com este ID já existe." });
                return;
            }

            res.status(201).json(user);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao criar a empresa", error: error.message });
    }
    };
        
    async getAllCompanies(req: Request, res: Response): Promise<void> {
        try {
            const companies = await this.companyService.getAllCompanies();

            if (!companies) {
                res.status(204).json({ message: "Não há empresas resgistradas" });
                return;
            }

            res.json(companies);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao obter as empresas", error: error.message });
        }
    };
        
    async getOneCompany(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params; 
            const company = await this.companyService.getOneCompany(Number(id));
    
            if (!company) {
                res.status(404).json({ message: "Empresa não encontrada" });
                return;
            }
    
            res.json(company);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao obter a empresa", error: error.message });
        }
    }

    async editOneCompany(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, password, type } = req.body;

            if (!id || !name || !password || !type) {
                res.status(400).json({ message: "Dados inválidos. Todos os campos são obrigatórios." });
                return
            }
    
            const company = await this.companyService.editOneCompany(Number(id), name, password, type);

            if(!company) {
                res.status(404).json({ message: "Empresa não encontrada." });
                return;
            }

            res.status(201).json(company);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao editar a empresa", error: error.message });
    }
    };
        
    async deleteOneCompany(req: Request, res: Response) {
        try {
            const { id } = req.params; 
            const deleted = await this.companyService.deleteOneCompany(Number(id));
    
            if (deleted) {
                return res.status(200).json({ message: `Empresa com ID ${id} excluída com sucesso.` });
            } else {
                return res.status(404).json({ message: `Empresa com ID ${id} não encontrada.` });
            }

        } catch (error: any) {
            res.status(500).json({ message: "Erro ao remover a empresa", error: error.message });
        }
    }

    
}

export default new UserController();
