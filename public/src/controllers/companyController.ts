import { CompanyService } from "../services/companyService";
import { Request, Response } from "express"

export class CompanyController {
    private companyService: CompanyService;

    constructor() {
        this.companyService = new CompanyService();
    }

    async createCompany(req: Request, res: Response): Promise<void> {
        try {
            const { name, manager_id, location } = req.body;

            if (!name) {
                res.status(400).json({ message: "O campo nome é obrigatório." });
                return;
            }
            if (!manager_id) {
                res.status(400).json({ message: "O campo id do gerente é obrigatório." });
                return;
            }
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
            if (!cpfRegex.test(manager_id)) {
                res.status(400).json({ message: "O campo id do gerente deve estar no formato XXX.XXX.XXX-XX." });
                return;
            }
            if (!location) {
                res.status(400).json({ message: "O campo localização é obrigatório." });
                return;
            }

            const company = await this.companyService.createCompany(name, manager_id, location);

            if (!company) {
                res.status(409).json({ message: "Uma empresa com este nome já existe." });
                return;
            }

            res.status(201).json(company);
        } catch (error: any) {
            if (error.message === 'Id do gerente inválido') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Erro ao criar a empresa", error: error.message });
            }
        }
    };

    async getAllCompanies(req: Request, res: Response): Promise<void> {
        try {
            const companies = await this.companyService.getAllCompanies();

            if (!companies) {
                res.status(204).json({ message: "Não há empresas registradas" });
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

            if (!id) {
                res.status(400).json({ message: "O campo id da empresa é obrigatório." });
                return;
            }
            if (isNaN(Number(id))) {
                res.status(400).json({ error: "O id da empresa deve ser um número" });
                return 
            }
            
            const company = await this.companyService.getOneCompany(Number(id));

            if (!company) {
                res.status(404).json({ message: `Empresa com id ${id} não encontrada.` });
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

            if (!id) {
                res.status(400).json({ message: "O campo id da empresa é obrigatório." });
                return;
            }
            if (isNaN(Number(id))) {
                res.status(400).json({ error: "O id da empresa deve ser um número" });
                return 
            }

            const { name, manager_id, location } = req.body;

            if (!id) {
                res.status(400).json({ message: "O campo id da empresa é obrigatório." });
                return;
            }
            if (!name) {
                res.status(400).json({ message: "O campo nome é obrigatório." });
                return;
            }
            if (!manager_id) {
                res.status(400).json({ message: "O campo id do gerente é obrigatório." });
                return;
            }
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
            if (!cpfRegex.test(manager_id)) {
                res.status(400).json({ message: "O campo id do gerente deve estar no formato XXX.XXX.XXX-XX." });
                return;
            }
            if (!location) {
                res.status(400).json({ message: "O campo localização é obrigatório." });
                return;
            }

            const company = await this.companyService.editOneCompany(Number(id), name, manager_id, location);

            if (!company) {
                res.status(404).json({ message: `Empresa com id ${id} não encontrada.` });
                return;
            }

            res.status(201).json(company);
        } catch (error: any) {
            if (error.message === 'Id do gerente inválido') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Erro ao editar a empresa", error: error.message });
            }
        }
    };

    async deleteOneCompany(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ message: "O campo id da empresa é obrigatório." });
                return;
            }
            if (isNaN(Number(id))) {
                res.status(400).json({ error: "O id da empresa deve ser um número" });
                return 
            }

            const deleted = await this.companyService.deleteOneCompany(Number(id));

            if (deleted) {
                res.status(204).json({ message: `Empresa com id ${id} excluída com sucesso.` });
                return;
            } else {
                res.status(404).json({ message: `Empresa com id ${id} não encontrada.` });
                return;
            }

        } catch (error: any) {
            res.status(500).json({ message: "Erro ao remover a empresa", error: error.message });
        }
    }
}

export default new CompanyController();
