import { BuildingRepository } from "../repository/buildingRepository";
import { Building } from "../models/Building"
import { CompanyService } from "./companyService";
import { UserService } from "./userService";

export class BuildingService {
    private buildingRepository: BuildingRepository;
    private companyService: CompanyService;
    private userService: UserService;

    constructor() {
        this.buildingRepository = new BuildingRepository();
        this.companyService = new CompanyService();
        this.userService = new UserService();
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
            throw new Error(`Empresa com id ${company_id} não encontrada.`);
        }

        const buildings = await this.buildingRepository.getBuildingsByCompany(company_id);
        return buildings;
    }

    async getBuildingsByManager(manager_id: string): Promise<Building[] | null> {
        const manager = await this.userService.getOneUser(manager_id)
        if (!manager) {
            throw new Error(`Gerente com id ${manager_id} não encontrado.`);
        }

        const companies = await this.companyService.getCompaniesByManager(manager_id);

        if (!companies) {
            throw new Error(`Não há empresas e, por isso, prédios registrados para o gerente com id ${manager_id}.`);
        }

        let buildings: Building[] = [];

        for (const company of companies) {
            const companyBuildings = await this.getBuildingsByCompany(company.id);
            if (!companyBuildings) {
                continue;
            }
            buildings.push(...companyBuildings);
        }
        
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
