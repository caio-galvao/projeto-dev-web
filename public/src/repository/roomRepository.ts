import { Room } from "../models/Room";
import { Reserve } from "../models/Reserve";

export class RoomRepository {
    // Criar uma nova sala
    async createRoom(id: number, building_id: number, manager_id: string, name: string, scheduler: string, workspace_config: string, equipments: string) {
        try {
            const existingRoom = await Room.findOne({ where: { name } });
            if (existingRoom) {
                throw new Error("Uma sala com este nome já existe.");
            }

            const scheduler = "";
            const workspace_config = "";
            const equipments: string[] = [];

            const room = await Room.create({
                id,
                building_id,
                manager_id,
                name,
                scheduler,
                workspace_config,
                equipments
            });
            return room;
        } catch (error: any) {
            throw new Error(`Erro ao criar sala: ${error.message}`);
        }
    }

    // Obter todas as salas
    async getAllRooms() {
        try {
            const rooms = await Room.findAll();
            if (rooms.length === 0) {
                return null; // Nenhuma sala registrada
            }
            return rooms;
        } catch (error: any) {
            throw new Error(`Erro ao listar salas: ${error.message}`);
        }
    }

    // Obter uma sala pelo ID
    async getRoomById(id: number) {
        try {
            const room = await Room.findByPk(id);
            if (!room) {
                throw new Error(`Sala com ID ${id} não encontrada.`);
            }
            return room;
        } catch (error: any) {
            throw new Error(`Erro ao buscar sala com ID ${id}: ${error.message}`);
        }
    }

    // Atualizar uma sala
    async updateRoom(id: number, updatedData: Partial<{ name: string; manager_id: string; location: string }>) {
        try {
            const room = await this.getRoomById(id);
            if (!room) {
                throw new Error(`Sala com ID ${id} não encontrada.`);
            }
            await room.update(updatedData);
            return room;
        } catch (error: any) {
            throw new Error(`Erro ao atualizar sala com ID ${id}: ${error.message}`);
        }
    }

    // Excluir uma sala
    async deleteRoom(id: number) {
        try {
            const room = await this.getRoomById(id);
            if (!room) {
                throw new Error(`Sala com ID ${id} não encontrada.`);
            }
            await room.destroy();
            return true;
        } catch (error: any) {
            throw new Error(`Erro ao excluir sala com ID ${id}: ${error.message}`);
        }
    }
}
