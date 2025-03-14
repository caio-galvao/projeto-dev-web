import { UserRepository } from "../repository/userRepository";
import { User } from "../models/User"
import { hashPassword } from "../utils/auth"

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(id: string, name: string, password: string, type: string): Promise<User | null> {
        const hashedPassword = await hashPassword(password)
        return this.userRepository.createUser(id, name, hashedPassword, type)
    }

    async getAllUsers(): Promise<User[] | null> {
        const users = await this.userRepository.getAllUsers();
        return users;
    }

    async getOneUser(id: string): Promise<User | null > {
        const user = await this.userRepository.getUserById(id);
        return user;
    }

    async editOneUser(id: string, name: string, password: string, type: string): Promise<User | null> {
        return this.userRepository.updateUser(id, { name, password, type })
    }

    async deleteOneUser(id: string): Promise<User | null> {
        return this.userRepository.deleteUser(id)
    }
}
