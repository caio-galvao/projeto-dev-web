import { ReserveRepository } from "../repository/reserveRepository";
import { Reserve } from "../models/Reserve"
import { UserService } from "./userService";
import { WorkspaceService } from "./workspaceService";
import { RoomService } from "./roomService";

export class ReserveService {
    private reserveRepository: ReserveRepository;
    private userService: UserService;
    private workspaceService: WorkspaceService;
    private roomService: RoomService;

    constructor() {
        this.reserveRepository = new ReserveRepository();
        this.userService = new UserService();
        this.workspaceService = new WorkspaceService();
        this.roomService = new RoomService();
    }

    async createReserve( user_id: string, workspace_id: number, time: string) : Promise<Reserve | null> {
        const user = await this.userService.getOneUser(user_id)
        if (!user) {
            throw new Error(`Id do usuário não encontrado.`);
        }

        const workspace = await this.workspaceService.getOneWorkspace(workspace_id)
        if (!workspace) {
            throw new Error(`Id do espaço de trabalho não encontrado.`);
        }

        return this.reserveRepository.createReserve(user_id, workspace_id, time)
    }

    async getReservesByWorkspace(workspace_id: number): Promise<Reserve[] | null> {
        const workspace = await this.workspaceService.getOneWorkspace(workspace_id)
        if (!workspace) {
            throw new Error(`Espaço de trabalho com ID ${workspace_id} não encontrado.`);
        }

        const reserves = await this.reserveRepository.getReservesByWorkspace(workspace_id);
        return reserves;
    }

    async getReservesByUser(user_id: string): Promise<Reserve[] | null> {
        const user = await this.userService.getOneUser(user_id)
        if (!user) {
            throw new Error(`Usuário com ID ${user_id} não encontrado.`);
        }

        const reserves = await this.reserveRepository.getReservesByUser(user_id);
        return reserves;
    }

    async getReservesByRoomTimestamp(room_id: number, timestamp: string): Promise<Reserve[] | null> {
        const room = await this.roomService.getOneRoom(room_id)
        if (!room) {
            throw new Error(`Sala com ID ${room_id} não encontrada.`);
        }

        const reserves = await this.getReservesByRoom(room_id);
        if (!reserves) {
            return null;
        }

        const filteredReserves = reserves.filter(reserve => reserve.time === timestamp);
    
        if (filteredReserves.length === 0) {
            return null;
        }
        
        return filteredReserves;
    }

    async getReservesByRoom(room_id: number): Promise<Reserve[] | null> {
        const room = await this.roomService.getOneRoom(room_id)
        if (!room) {
            throw new Error(`Sala com ID ${room_id} não encontrada.`);
        }

        const workspaces = await this.workspaceService.getWorkspacesByRoom(room.id)

        if (!workspaces) {
            throw new Error(`Não há espaços de trabalho cadastrados na sala ${room_id}.`);
        }

        let reserves: Reserve[] = [];

        for (const workspace of workspaces) {
            const workspaceReserves = await this.getReservesByWorkspace(workspace.id);
            if (!workspaceReserves) {
                continue;
            }
            reserves.push(...workspaceReserves);
        }
        return reserves;
    }

    async getOneReserve(id: number): Promise<Reserve | null > {
        const reserve = await this.reserveRepository.getReserveById(id);
        return reserve;
    }

    async deleteOneReserve(id: number): Promise<boolean> {
        return this.reserveRepository.deleteReserve(id)
    }
}
