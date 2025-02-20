import { BuildingRepository } from "../repository/buildingRepository";
import { Building } from "../models/Building"

export class BuildingService {
    private buildingRepository: BuildingRepository;

    constructor() {
        this.buildingRepository = new BuildingRepository();
    }

    async createBuilding(id: number, name: string, company_id: number): Promise<Building | null> {
        return this.buildingRepository.createBuilding(id, name, company_id)
    }

    async getBuildingsByCompany(company_id: number): Promise<Building[] | null> {
        const buildings = await this.buildingRepository.getBuildingsByCompany(company_id);
        return buildings;
    }

    async getOneBuilding(id: number): Promise<Building | null > {
        const user = await this.buildingRepository.getBuildingById(id);
        return user;
    }

    async editOneBuilding(id: number, name: string, company_id: number): Promise<Building | null> {
        return this.buildingRepository.updateBuilding(id, { name, company_id })
    }

    async deleteOneBuilding(id: number): Promise<boolean> {
        return this.buildingRepository.deleteBuilding(id)
    }
}
