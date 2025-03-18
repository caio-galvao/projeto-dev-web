import { BuildingService } from "../services/buildingService";
import { Request, Response } from "express"

export class BuildingController {
    private buildingService: BuildingService;

    constructor() {
        this.buildingService = new BuildingService();
    }

    async createBuilding(req: Request, res: Response): Promise<void> {
        try {
            const { name, company_id } = req.body;

            if (!name) {
                res.status(400).json({ message: "O campo nome é obrigatório." });
                return;
            }
            if (!company_id) {
                res.status(400).json({ message: "O campo id da empresa é obrigatório." });
                return;
            }

            const building = await this.buildingService.createBuilding(name, company_id);

            if (!building) {
                res.status(409).json({ message: "Um prédio com este nome já existe." });
                return;
            }

            res.status(201).json(building);
        } catch (error: any) {
            if (error.message === `Id da empresa inválido`) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Erro ao criar o prédio", error: error.message });
            }
        }
    };

    async getBuildingByCompany(req: Request, res: Response): Promise<void> {
        try {
            const { company_id } = req.params;

            if (!company_id) {
                res.status(400).json({ message: "O campo id da empresa é obrigatório." });
                return;
            }
            if (isNaN(Number(company_id))) {
                res.status(400).json({ error: "O id da empresa deve ser um número." });
                return;
            }

            const buildings = await this.buildingService.getBuildingsByCompany(Number(company_id));

            if (!buildings) {
                res.status(204).json({ message: `Não há prédios registrados para a empresa com id ${company_id}` });
                return;
            }

            res.json(buildings);
        } catch (error: any) {
            if (error.message.startsWith('Empresa com ID ')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Erro ao obter os prédios", error: error.message });
            }
        }
    };

    async getOneBuilding(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ message: "O campo id do prédio é obrigatório." });
                return;
            }
            if (isNaN(Number(id))) {
                res.status(400).json({ error: "O id do prédio deve ser um número." });
                return;
            }

            const building = await this.buildingService.getOneBuilding(Number(id));

            if (!building) {
                res.status(404).json({ message: `Prédio com ID ${id} não encontrado.` });
                return;
            }

            res.json(building);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao obter o prédio", error: error.message });
        }
    }

    async editOneBuilding(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, company_id } = req.body;

            if (!id) {
                res.status(400).json({ message: "O campo id do prédio é obrigatório." });
                return;
            }
            if (isNaN(Number(id))) {
                res.status(400).json({ error: "O id do prédio deve ser um número." });
                return;
            }
            if (!name) {
                res.status(400).json({ message: "O campo nome é obrigatório." });
                return;
            }
            if (!company_id) {
                res.status(400).json({ message: "O campo id da empresa é obrigatório." });
                return;
            }

            const building = await this.buildingService.editOneBuilding(Number(id), name, company_id);

            if (!building) {
                res.status(404).json({ message: `Prédio com ID ${id} não encontrado.` });
                return;
            }

            res.status(201).json(building);
        } catch (error: any) {
            if (error.message === `Id da empresa inválido`) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Erro ao editar o prédio", error: error.message });
            }
        }
    };

    async deleteOneBuilding(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ message: "O campo id do prédio é obrigatório." });
                return;
            }
            if (isNaN(Number(id))) {
                res.status(400).json({ error: "O id do prédio deve ser um número." });
                return;
            }

            const deleted = await this.buildingService.deleteOneBuilding(Number(id));

            if (deleted) {
                res.status(204).json({ message: `Prédio com ID ${id} excluído com sucesso.` });
                return;
            } else {
                res.status(404).json({ message: `Prédio com ID ${id} não encontrado.` });
                return;
            }

        } catch (error: any) {
            res.status(500).json({ message: "Erro ao remover o prédio", error: error.message });
        }
    }
}

export default new BuildingController();
