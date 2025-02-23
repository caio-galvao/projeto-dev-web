import { BuildingRepository } from "../repository/buildingRepository";
import { Building } from "../models/Building"
import { CompanyService } from "./companyService";

export class BuildingService {
    private buildingRepository: BuildingRepository;
    private companyService: CompanyService;

    constructor() {
        this.buildingRepository = new BuildingRepository();
        this.companyService = new CompanyService();
    }

    async createBuilding( name: string, company_id: number): Promise<Building | null> {
        const company = await this.companyService.getOneCompany(company_id)
        if (!company) {
            throw new Error(`Id da empresa inválido`);
        }

        return this.buildingRepository.createBuilding(name, company_id)
    }

    async getBuildingsByCompany(company_id: number): Promise<Building[] | null> {
        const company = await this.companyService.getOneCompany(company_id)
        if (!company) {
            throw new Error(`Empresa com ID ${company_id} não encontrada.`);
        }

        const buildings = await this.buildingRepository.getBuildingsByCompany(company_id);
        return buildings;
    }

    async getOneBuilding(id: number): Promise<Building | null > {
        const user = await this.buildingRepository.getBuildingById(id);
        return user;
    }

    async editOneBuilding(id: number, name: string, company_id: number): Promise<Building | null> {
        const company = await this.companyService.getOneCompany(company_id)
        if (!company) {
            throw new Error(`Id da empresa inválido`);
        }

        return this.buildingRepository.updateBuilding(id, { name, company_id })
    }

    async deleteOneBuilding(id: number): Promise<boolean> {
        return this.buildingRepository.deleteBuilding(id)
    }
}
