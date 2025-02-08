import { User } from "../models/User";
export class UserRepository {
 // Criar um novo usuário
    async createUser(id: string, name: string, permission: string, password: string) {
    // Use o método `create` para salvar no banco de dados
        return await User.create({
            id,
            name,
            permission,
            password
        });
    }
    async getAllUsers() {
      return await User.findAll();
    }
}
