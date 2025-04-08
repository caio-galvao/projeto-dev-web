import { CompanyRepository } from "../repository/companyRepository";
import { Company } from "../models/Company"
import { UserService } from "./userService";
import { BuildingService } from "./buildingService";

export class CompanyService {
    private companyRepository: CompanyRepository;
    private userService: UserService;
    private buildingService: BuildingService;

    constructor() {
        this.companyRepository = new CompanyRepository();
        this.userService = new UserService();
        this.buildingService = new BuildingService();
    }

    async createCompany( name: string, manager_id: string, location: string): Promise<Company | null> {
        const manager = await this.userService.getOneUser(manager_id)
        if (!manager) {
            throw new Error(`Id do gerente inválido`);
        }
        
        return this.companyRepository.createCompany( name, manager_id, location)
    }

    async getAllCompanies(): Promise<Company[] | null> {
        const companies = await this.companyRepository.getAllCompanies();
        return companies;
    }

    async getOneCompany(id: number): Promise<Company | null > {
        const company = await this.companyRepository.getCompanyById(id);
        return company;
    }

    async getCompaniesByManager(manager_id: string): Promise<Company[] | null> {
        const manager = await this.userService.getOneUser(manager_id)
        if (!manager) {
            throw new Error(`Gerente com id ${manager_id} não encontrado.`);
        }

        const companies = await this.companyRepository.getCompaniesByManager(manager_id);
        return companies;
    }

    async getCompaniesByRegisteredUser(user_id: string): Promise<Company[] | null> {
        const buildings = await this.buildingService.getBuildingsByRegisteredUser(user_id)

        if (!buildings) {
            return null;
        }

        let companies: Company[] = [];

        for (const building of buildings) {
            const company = await this.getOneCompany(building.company_id);
            if (!company) {
                continue;
            }
            companies.push(company);
        }
        
        return companies;
    }

    async editOneCompany(id: number, name: string, manager_id: string, location: string): Promise<Company | null> {
        const manager = await this.userService.getOneUser(manager_id)
        if (!manager) {
            throw new Error(`Id do gerente inválido`);
        }

        return this.companyRepository.updateCompany(id, { name, manager_id, location })
    }

    async deleteOneCompany(id: number): Promise<boolean> {
        return this.companyRepository.deleteCompany(id)
    }
}
