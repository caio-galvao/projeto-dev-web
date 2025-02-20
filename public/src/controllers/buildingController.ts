import { BuildingService } from "../services/buildingService";
import { Request, Response } from "express"

export class BuildingController {
    private buildingService: BuildingService;

    constructor() {
        this.buildingService = new BuildingService();
    }

    async createBuilding(req: Request, res: Response): Promise<void> {
        try {
            const { id, name, company_id } = req.body;

            if (!id || !name || !company_id) {
                res.status(400).json({ message: "Dados inválidos. Todos os campos são obrigatórios." });
                return
            }
    
            const building = await this.buildingService.createBuilding(id, name, company_id);

            if(!building) {
                res.status(409).json({ message: "Um prédio com este ID já existe." });
                return;
            }

            res.status(201).json(building);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao criar o prédio", error: error.message });
    }
    };
        
    async getBuildingByCompany(req: Request, res: Response): Promise<void> {
        try {
            const { company_id } = req.params;
            const buildings = await this.buildingService.getBuildingsByCompany(Number(company_id));

            if (!buildings) {
                res.status(204).json({ message: "Não há prédios resgistradas" });
                return;
            }

            res.json(buildings);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao obter os prédios", error: error.message });
        }
    };
        
    async getOneBuilding(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params; 
            const building = await this.buildingService.getOneBuilding(Number(id));
    
            if (!building) {
                res.status(404).json({ message: "Prédio não encontrado" });
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

            if (!id || !name || !company_id ) {
                res.status(400).json({ message: "Dados inválidos. Todos os campos são obrigatórios." });
                return
            }
    
            const building = await this.buildingService.editOneBuilding(Number(id), name, company_id);

            if(!building) {
                res.status(404).json({ message: "Prédio não encontrado." });
                return;
            }

            res.status(201).json(building);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao editar o prédio", error: error.message });
    }
    };
        
    async deleteOneBuilding(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params; 
            const deleted = await this.buildingService.deleteOneBuilding(Number(id));
    
            if (deleted) {
                res.status(200).json({ message: `Prédio com ID ${id} excluído com sucesso.` });
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
