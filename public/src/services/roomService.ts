import { RoomRepository } from "../repository/roomRepository";
import { Room } from "../models/Room"
import { User } from "../models/User"
import { WorkspaceRepository } from "../repository/workspaceRepository";

export class RoomService {
    private roomRepository: RoomRepository;
    private workspaceRepository: WorkspaceRepository

    constructor() {
        this.roomRepository = new RoomRepository();
        this.workspaceRepository = new WorkspaceRepository();
    }
 
    async createRoom(id: number, building_id: number, manager_id: string, name: string, schedule: string, workspace_config: string, equipments: Array<string>): Promise<Room | null> {
        const room = await this.roomRepository.createRoom(id, building_id, manager_id, name, schedule, workspace_config, equipments)
        
        const workspaces_by_row = workspace_config.split(',').map(pair => pair.split(':')[1]);
        const num_workspaces = workspaces_by_row.map(Number).reduce((accumulator, currentValue) => accumulator + currentValue, 0);        

        var i: number = 0
        for (i; i < num_workspaces; i++) {
            this.workspaceRepository.createWorkspace(id, i+1, []);
        }
        
        return room
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
