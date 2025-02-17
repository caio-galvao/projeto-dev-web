import { Company } from "../models/Company";

export class CompanyRepository {
    // Criar uma nova empresa
    async createCompany(id: number, name: string, manager_id: string, location: string) {
        try {
            const existingCompany = await Company.findOne({ where: { name } });
            if (existingCompany) {
                throw new Error("Uma empresa com este nome já existe.");
            }
            const company = await Company.create({ id, name, manager_id, location });
            return company;
        } catch (error: any) {
            throw new Error(`Erro ao criar empresa: ${error.message}`);
        }
    }

    // Obter todas as empresas
    async getAllCompanies() {
        try {
            const companies = await Company.findAll();
            if (companies.length === 0) {
                return null; // Nenhuma empresa registrada
            }
            return companies;
        } catch (error: any) {
            throw new Error(`Erro ao listar empresas: ${error.message}`);
        }
    }

    // Obter uma empresa pelo ID
    async getCompanyById(id: number) {
        try {
            const company = await Company.findByPk(id);
            if (!company) {
                throw new Error(`Empresa com ID ${id} não encontrada.`);
            }
            return company;
        } catch (error: any) {
            throw new Error(`Erro ao buscar empresa com ID ${id}: ${error.message}`);
        }
    }

    // Atualizar uma empresa
    async updateCompany(id: number, updatedData: Partial<{ name: string; address: string; email: string }>) {
        try {
            const company = await this.getCompanyById(id);
            if (!company) {
                throw new Error(`Empresa com ID ${id} não encontrada.`);
            }
            await company.update(updatedData);
            return company;
        } catch (error: any) {
            throw new Error(`Erro ao atualizar empresa com ID ${id}: ${error.message}`);
        }
    }

    // Excluir uma empresa
    async deleteCompany(id: number) {
        try {
            const company = await this.getCompanyById(id);
            if (!company) {
                throw new Error(`Empresa com ID ${id} não encontrada.`);
            }
            await company.destroy();
            return true;
        } catch (error: any) {
            throw new Error(`Erro ao excluir empresa com ID ${id}: ${error.message}`);
        }
    }
}
