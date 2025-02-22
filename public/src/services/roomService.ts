import { RoomRepository } from "../repository/roomRepository";
import { Room } from "../models/Room"
import { User } from "../models/User"

export class RoomService {
    private roomRepository: RoomRepository;

    constructor() {
        this.roomRepository = new RoomRepository();
    }
 
    async createRoom(id: number, building_id: number, manager_id: string, name: string, schedule: string, workspace_config: string, equipments: Array<string>): Promise<Room | null> {
        return this.roomRepository.createRoom(id, building_id, manager_id, name, schedule, workspace_config, equipments)
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
        return this.roomRepository.updateRoom(id, { building_id, manager_id, name, schedule, workspace_config, equipments })
    }

    async deleteOneRoom(id: number): Promise<boolean> {
        return this.roomRepository.deleteRoom(id)
    }

    // async getUsersByRoom(id: number): Promise<User[] | null> {
    //     return this.roomRepository.getUsersByRoom(id)
    // }
}
