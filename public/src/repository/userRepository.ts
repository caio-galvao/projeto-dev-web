import { User } from "../models/User";

export class UserRepository {
    // Criar um novo usuário
    async createUser(id: string, name: string, password: string, type: string) {
        try {
            const existingUser = await User.findOne({ where: { id } });
            if (existingUser) {
                throw new Error("Um usuário com este CPF já existe.");
            }
            const user = await User.create({
                id,
                name,
                password,
                type,
            });
            return user;
        } catch (error: any) {
            throw new Error(`Erro ao criar usuário: ${error.message}`);
        }
    }

    // Obter todos os usuários
    async getAllUsers() {
        try {
            const users = await User.findAll();
            if (users.length === 0) {
                return null; // Retorna null se não houver usuários
            }
            return users;
        } catch (error: any) {
            throw new Error(`Erro ao listar usuários: ${error.message}`);
        }
    }

    // Obter um usuário pelo ID
    async getUserById(id: string) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error(`Usuário com CPF ${id} não encontrado.`);
            }
            return user;
        } catch (error: any) {
            throw new Error(`Erro ao buscar usuário com CPF ${id}: ${error.message}`);
        }
    }

    // Atualizar um usuário
    async updateUser(id: string, updatedData: Partial<{ name: string; password: string; type: string }>) {
        try {
            const user = await this.getUserById(id);
            if (!user) {
                throw new Error(`Usuário com CPF ${id} não encontrado.`);
            }
            await user.update(updatedData);
            return user;
        } catch (error: any) {
            throw new Error(`Erro ao atualizar usuário com CPF ${id}: ${error.message}`);
        }
    }

    // Excluir um usuário
    async deleteUser(id: string) {
        try {
            const user = await this.getUserById(id);
            if (!user) {
                throw new Error(`Usuário com CPF ${id} não encontrado.`);
            }
            await user.destroy();
            return true;
        } catch (error: any) {
            throw new Error(`Erro ao excluir usuário com CPF ${id}: ${error.message}`);
        }
    }
}
