import { CompanyRepository } from "../repository/companyRepository";
import { Company } from "../models/Company"

export class CompanyService {
    private companyRepository: CompanyRepository;

    constructor() {
        this.companyRepository = new CompanyRepository();
    }

    async createCompany( name: string, manager_id: string, location: string): Promise<Company | null> {
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
        return this.companyRepository.updateCompany(id, { name, manager_id, location })
    }

    async deleteOneCompany(id: number): Promise<boolean> {
        return this.companyRepository.deleteCompany(id)
    }
}
