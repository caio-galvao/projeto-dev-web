import { UserRepository } from "../repository/userRepository";
import { User } from "../models/User"
import {UserDTO} from "../dto/userDTO"
import { hashPassword } from "../utils/auth"

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(id: string, name: string, password: string, type: string): Promise<UserDTO | null> {
        const hashedPassword = await hashPassword(password)
        const user = await this.userRepository.createUser(id, name, hashedPassword, type)
        return new UserDTO(user);
    }

    async getAllUsers(): Promise<UserDTO[] | null> {
        const users = await this.userRepository.getAllUsers();
        if (!users) return null;
    
        return users.map(user => new UserDTO(user));
    }
    
    async getOneUser(id: string): Promise<UserDTO | null > {
        const user = await this.userRepository.getUserById(id);
        return new UserDTO(user);
    }

    async editOneUser(id: string, name: string, password: string, type: string): Promise<UserDTO | null> {
        const user = await this.userRepository.updateUser(id, { name, password, type })
        return new UserDTO(user);
    }

    async deleteOneUser(id: string): Promise<UserDTO | null> {
        const user = await this.userRepository.deleteUser(id)
        return new UserDTO(user);
    }
}
