import { RoomRepository } from "../repository/roomRepository";
import { BuildingService } from "./buildingService";
import { UserService } from "./userService";

import { Room } from "../models/Room"
import { RoomUser } from "../models/RoomUser"
import { User } from "../models/User"
import {UserDTO} from "../dto/userDTO"

export class RoomService {
    private roomRepository: RoomRepository;
    private buildingService: BuildingService;
    private userService: UserService;

    constructor() {
        this.roomRepository = new RoomRepository();
        this.buildingService = new BuildingService();
        this.userService = new UserService();

    }
 
    async createRoom(building_id: number, manager_id: string, name: string, schedule: string, workspace_config: string, equipments: Array<string>): Promise<Room | null> {
        const building = await this.buildingService.getOneBuilding(building_id);
        if (!building) {
            throw new Error("Id do prédio não encontrado");
        }
        const manager = await this.userService.getOneUser(manager_id);
        if (!manager) {
            throw new Error("Id do gerente não encontrado");
        }
        return this.roomRepository.createRoom(building_id, manager_id, name, schedule, workspace_config, equipments)
    }

    async getRoomsByBuilding(building_id: number): Promise<Room[] | null> {
        const rooms = await this.roomRepository.getRoomsByBuilding(building_id);
        return rooms;
    }

    async getRoomsByManager(manager_id: string): Promise<Room[] | null> {
        const rooms = await this.roomRepository.getRoomsByManager(manager_id);
        return rooms;
    }

    async getOneRoom(id: number): Promise<Room | null > {
        const user = await this.roomRepository.getRoomById(id);
        return user;
    }

    async editOneRoom(id: number, building_id: number, manager_id: string, name: string, schedule: string, workspace_config: string, equipments: string[]): Promise<Room | null> {
        const building = await this.buildingService.getOneBuilding(building_id);
        if (!building) {
            throw new Error("Id do prédio não encontrado");
        }
        const manager = await this.userService.getOneUser(manager_id);
        if (!manager) {
            throw new Error("Id do gerente não encontrado");
        }
        return this.roomRepository.updateRoom(id, { building_id, manager_id, name, schedule, workspace_config, equipments })
    }

    async deleteOneRoom(id: number): Promise<boolean> {
        return this.roomRepository.deleteRoom(id)
    }

    async getUsersByRoom(id: number): Promise<UserDTO[] | null> {
        const room = await this.getOneRoom(id);
        if (!room) {
            throw new Error("Id da sala não encontrado");
        }
        const users = await this.roomRepository.getUsersByRoom(id);
        if (!users) return null;

        return users.map(user => new UserDTO(user));
    }

    async addUserInRoom(room_id: number, user_id: string): Promise<RoomUser | null> {
        const room = await this.getOneRoom(room_id);
        if (!room) {
            throw new Error("Id da sala não encontrado");
        }
        const user = await this.userService.getOneUser(user_id);
        if (!user) {
            throw new Error("Id do usuário não encontrado");
        }
        return this.roomRepository.addUserInRoom(room_id, user_id)
    }

    async deleteUserFromRoom(room_id: number, user_id: string): Promise<boolean> {
        return this.roomRepository.deleteUserFromRoom(room_id, user_id)
    }
}
