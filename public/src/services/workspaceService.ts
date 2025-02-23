import { WorkspaceRepository } from "../repository/workspaceRepository";
import { Workspace } from "../models/Workspace"
import { RoomService } from "./roomService";

export class WorkspaceService {
    private workspaceRepository: WorkspaceRepository;
    private roomService: RoomService;

    constructor() {
        this.workspaceRepository = new WorkspaceRepository();
        this.roomService = new RoomService();
    }

    async getWorkspacesByRoom(room_id: number): Promise<Workspace[] | null> {
        const room = await this.roomService.getOneRoom(room_id)
        if (!room) {
            throw new Error(`Sala com ID ${room_id} não encontrada.`);
        }

        const workspaces = await this.workspaceRepository.getWorkspacesByRoom(room_id);
        return workspaces;
    }

    async getOneWorkspace(id: number): Promise<Workspace | null > {
        const workspace = await this.workspaceRepository.getWorkspaceById(id);
        return workspace;
    }

    async editOneWorkspace(id: number, room_id: number, position: number, equipments: Array<string>): Promise<Workspace | null> {
        const room = await this.roomService.getOneRoom(room_id)
        if (!room) {
            throw new Error('Id da sala inválido');
        }

        return this.workspaceRepository.updateWorkspace(id, { room_id, position, equipments })
    }
}
