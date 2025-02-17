import { UserRepository } from "../repository/userRepository";
import { User } from "../models/User"

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(id: string, name: string, password: string, type: string): Promise<User> {
        return this.userRepository.createUser(id, name, password, type)
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.getAllUsers();
    }
}