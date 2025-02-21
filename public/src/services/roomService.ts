import { RoomRepository } from "../repository/roomRepository";
import { Room } from "../models/Room"

export class RoomService {
    private roomRepository: RoomRepository;

    constructor() {
        this.roomRepository = new RoomRepository();
    }
 
    async createRoom(id: number, building_id: number, manager_id: string, name: string, schedule: string, workspace_config: string, equipments: Array<string>): Promise<Room | null> {
        return this.roomRepository.createRoom(id, building_id, manager_id, name, schedule, workspace_config, equipments)
    }

    // async getRoomsByCompany(company_id: number): Promise<Room[] | null> {
    //     const rooms = await this.roomRepository.getRoomsByCompany(company_id);
    //     return rooms;
    // }

    // async getOneRoom(id: number): Promise<Room | null > {
    //     const user = await this.roomRepository.getRoomById(id);
    //     return user;
    // }

    // async editOneRoom(id: number, name: string, company_id: number): Promise<Room | null> {
    //     return this.roomRepository.updateRoom(id, { name, company_id })
    // }

    // async deleteOneRoom(id: number): Promise<boolean> {
    //     return this.roomRepository.deleteRoom(id)
    // }
}
