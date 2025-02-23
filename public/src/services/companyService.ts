import { CompanyRepository } from "../repository/companyRepository";
import { Company } from "../models/Company"
import { UserService } from "./userService";

export class CompanyService {
    private companyRepository: CompanyRepository;
    private userService: UserService;

    constructor() {
        this.companyRepository = new CompanyRepository();
        this.userService = new UserService();
    }

    async createCompany( name: string, manager_id: string, location: string): Promise<Company | null> {
        const manager = await this.userService.getOneUser(manager_id)
        if (!manager) {
            throw new Error(`Id do gerente inválido`);
        }
        
        return this.companyRepository.createCompany( name, manager_id, location)
    }

    async getAllCompanies(): Promise<Company[] | null> {
        const users = await this.companyRepository.getAllCompanies();
        return users;
    }

    async getOneCompany(id: number): Promise<Company | null > {
        const user = await this.companyRepository.getCompanyById(id);
        return user;
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
