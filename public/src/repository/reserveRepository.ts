import { Reserve } from "../models/Reserve";

export class ReserveRepository {
    // Criar uma nova reserva
    async createReserve( user_id: string, workspace_id: number, time: string) {
        try {
            const existingReserve = await Reserve.findOne({ where: { workspace_id, time } });
            if (existingReserve) {
                return null;
            }
            const reserve = await Reserve.create({ user_id, workspace_id, time });
            return reserve;
        } catch (error: any) {
            throw new Error(`Erro ao criar reserva: ${error.message}`);
        }

    }

    async getReservesByWorkspace(workspace_id: number) {
        try {
            const reserves = await Reserve.findAll({
                where: { workspace_id }
            });
            if (reserves.length === 0) {
                return null;
            }
            return reserves;
        } catch (error: any) {
            throw new Error(`Erro ao listar reservas: ${error.message}`);
        }
    }

    async getReservesByUser(user_id: string) {
        try {
            const reserves = await Reserve.findAll({
                where: { user_id }
            });
            if (reserves.length === 0) {
                return null;
            }
            return reserves;
        } catch (error: any) {
            throw new Error(`Erro ao listar reservas: ${error.message}`);
        }
    }

    async getReserveById(id: number) {
        try {
            const reserve = await Reserve.findByPk(id);
            if (!reserve) {
                return null;
            }
            return reserve;
        } catch (error: any) {
            throw new Error(`Erro ao buscar reserva com ID ${id}: ${error.message}`);
        }
    }

    async deleteReserve(id: number) {
        try {
            const reserve = await this.getReserveById(id);
            if (!reserve) {
                return false;
            }
            await reserve.destroy();
            return true;
        } catch (error: any) {
            throw new Error(`Erro ao excluir reserva com ID ${id}: ${error.message}`);
        }
    }
}
