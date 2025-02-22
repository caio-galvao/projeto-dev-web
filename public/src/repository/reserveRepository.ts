import { Reserve } from "../models/Reserve";

export class ReserveRepository {
    // Criar uma nova reserva
    async createReserve(id: number, user_id: string, workspace_id: number, room_id: number, time: string) {
        return await Reserve.create({
            id,
            user_id,
            workspace_id,
            room_id,
            time,
        });
    }
}
