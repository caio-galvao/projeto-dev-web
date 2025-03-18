import { ReserveRepository } from "../repository/reserveRepository";
import { Reserve } from "../models/Reserve"
import { UserService } from "./userService";
import { WorkspaceService } from "./workspaceService";

export class ReserveService {
    private reserveRepository: ReserveRepository;
    private userService: UserService;
    private workspaceService: WorkspaceService;

    constructor() {
        this.reserveRepository = new ReserveRepository();
        this.userService = new UserService();
        this.workspaceService = new WorkspaceService();
    }

    async createReserve( user_id: string, workspace_id: number, time: string) : Promise<Reserve | null> {
        const user = await this.userService.getOneUser(user_id)
        if (!user) {
            throw new Error(`Id do usuário inválido`);
        }

        const workspace = await this.workspaceService.getOneWorkspace(workspace_id)
        if (!workspace) {
            throw new Error(`Id do espaço de trabalho inválido`);
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

    async getOneReserve(id: number): Promise<Reserve | null > {
        const reserve = await this.reserveRepository.getReserveById(id);
        return reserve;
    }

    async deleteOneReserve(id: number): Promise<boolean> {
        return this.reserveRepository.deleteReserve(id)
    }
}
