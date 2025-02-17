import { Workspace } from "../models/Workspace";

export class WorkspaceRepository {
    // Obter reservas em um workspace
    async getReservesByWorkspace(id: number, user_id: string, room_id: number) {
        return await Workspace.findOne({
            where: { id: user_id, room_id },
            include: ["reserves"],
        });
    }

    // Editar um workspace
    async editWorkspace(room_id: number, user_id: number, data: Partial<Workspace>) {
        const workspace = await Workspace.findOne({ where: { id: user_id, room_id } });
        if (!workspace) return null;
        
        return await workspace.update(data);
    }
}
