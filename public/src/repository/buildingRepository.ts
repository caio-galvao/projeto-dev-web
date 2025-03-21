import { Building } from "../models/Building";

export class BuildingRepository {

    async createBuilding( name: string, company_id: number) {
        try {
            const existingBuilding = await Building.findOne({ where: { name } });
            if (existingBuilding) {
                return null;
            }
            const building = await Building.create({ name, company_id });
            return building;
        } catch (error: any) {
            throw new Error(`Erro ao criar prédio: ${error.message}`);
        }
    }

    async getBuildingsByCompany(company_id: number) {
        try {
            const buildings = await Building.findAll({
                where: { company_id }
            });
            if (buildings.length === 0) {
                return null;
            }
            return buildings;
        } catch (error: any) {
            throw new Error(`Erro ao listar prédios: ${error.message}`);
        }
    }

    async getBuildingById(id: number) {
        try {
            const building = await Building.findByPk(id);
            if (!building) {
                return null;
            }
            return building;
        } catch (error: any) {
            throw new Error(`Erro ao buscar prédio com ID ${id}: ${error.message}`);
        }
    }

    async updateBuilding(id: number, updatedData: Partial<{ name: string, company_id: number}>) {
        try {
            const building = await this.getBuildingById(id);
            if (!building) {
                return null;
            }
            await building.update(updatedData);
            return building;
        } catch (error: any) {
            throw new Error(`Erro ao atualizar prédio com ID ${id}: ${error.message}`);
        }
    }

    async deleteBuilding(id: number) {
        try {
            const building = await this.getBuildingById(id);
            if (!building) {
                return false;
            }
            await building.destroy();
            return true;
        } catch (error: any) {
            throw new Error(`Erro ao excluir prédio com ID ${id}: ${error.message}`);
        }
    }
}
