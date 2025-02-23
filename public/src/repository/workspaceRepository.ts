import { Workspace } from "../models/Workspace";

export class WorkspaceRepository {
    // Obter reservas em um workspace
    async getReservesByWorkspace(id: number, room_id: number) {
        return await Workspace.findOne({
            where: { id: id, room_id },
            include: ["reserves"],
        });
    }

    async createWorkspace( room_id: number, position: number, equipments: Array<string>) {
        try {
            const workspace = await Workspace.create({ room_id, position, equipments });
            return workspace;
        } catch (error: any) {
            throw new Error(`Erro ao criar espaço de trabalho: ${error.message}`);
        }
    }

    async getWorkspacesByRoom(room_id: number) {
        try {
            const workspaces = await Workspace.findAll({
                where: { room_id }
            });
            if (workspaces.length === 0) {
                return null;
            }
            return workspaces;
        } catch (error: any) {
            throw new Error(`Erro ao listar espaços de trabalho: ${error.message}`);
        }
    }

    async getWorkspaceById(id: number) {
        try {
            const workspace = await Workspace.findByPk(id);
            if (!workspace) {
                return null;
            }
            return workspace;
        } catch (error: any) {
            throw new Error(`Erro ao buscar espaço de trabalho com ID ${id}: ${error.message}`);
        }
    }

    async updateWorkspace(id: number, data: Partial<Workspace>) {
        const workspace = await Workspace.findOne({ where: { id: id } });
        if (!workspace) return null;
        
        return await workspace.update(data);
    }
}
