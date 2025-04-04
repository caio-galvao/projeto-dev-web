import { BuildingRepository } from "../repository/buildingRepository";
import { Building } from "../models/Building"
import { UserService } from "./userService";
import { RoomService } from "./roomService";
import { CompanyRepository } from "../repository/companyRepository";

export class BuildingService {
    private buildingRepository: BuildingRepository;
    private companyRepository: CompanyRepository;
    private userService: UserService;
    private roomService: RoomService;

    constructor() {
        this.buildingRepository = new BuildingRepository();
        this.companyRepository = new CompanyRepository();
        this.userService = new UserService();
        this.roomService = new RoomService();
    }

    async createBuilding( name: string, company_id: number): Promise<Building | null> {
        const company = await this.companyRepository.getCompanyById(company_id)
        if (!company) {
            throw new Error(`Id da empresa inválido`);
        }

        return this.buildingRepository.createBuilding(name, company_id)
    }

    async getBuildingsByCompany(company_id: number): Promise<Building[] | null> {
        const company = await this.companyRepository.getCompanyById(company_id)
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

        const companies = await this.companyRepository.getCompaniesByManager(manager_id);

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

    async getBuildingsByRegisteredUser(user_id: string): Promise<Building[] | null> {
        const user = await this.userService.getOneUser(user_id)
        if (!user) {
            throw new Error(`Usuário com id ${user_id} não encontrado.`);
        }

        const rooms = await this.roomService.getRoomsByUser(user_id)

        if (!rooms) {
            return null;
        }

        let buildings: Building[] = [];

        for (const room of rooms) {
            const building = await this.getOneBuilding(room.building_id);
            if (!building) {
                continue;
            }
            buildings.push(building);
        }
        
        return buildings;
    }

    async getOneBuilding(id: number): Promise<Building | null > {
        const user = await this.buildingRepository.getBuildingById(id);
        return user;
    }

    async editOneBuilding(id: number, name: string, company_id: number): Promise<Building | null> {
        const company = await this.companyRepository.getCompanyById(company_id)
        if (!company) {
            throw new Error(`Id da empresa inválido`);
        }

        return this.buildingRepository.updateBuilding(id, { name, company_id })
    }

    async deleteOneBuilding(id: number): Promise<boolean> {
        return this.buildingRepository.deleteBuilding(id)
    }
}
