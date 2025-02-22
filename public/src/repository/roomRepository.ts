import { Room } from "../models/Room";
// import { UserRooms } from "../models/UserRooms";
// import { User } from "../models/User";

export class RoomRepository {
    // Criar uma nova sala
    async createRoom(id: number, building_id: number, manager_id: string, name: string, schedule: string, workspace_config: string, equipments: Array<string>) {
        try {
            const existingRoom = await Room.findOne({ where: { name } }) 
            if (existingRoom) {
                return null;
                throw new Error("Uma sala com este nome já existe.");
            }

            const room = await Room.create({
                id,
                building_id,
                name,
                manager_id,
                schedule,
                workspace_config,
                equipments
            });
            return room;
        } catch (error: any) {
            throw new Error(`Erro ao criar sala: ${error.message}`);
        }
    }

    async getRoomsByBuilding(building_id: number) {
        try {
            const rooms = await Room.findAll({ where: { building_id } });
            if (rooms.length === 0) {
                return null;
            }
            return rooms;
        } catch (error: any) {
            throw new Error(`Erro ao listar salas do prédio com ID ${building_id}: ${error.message}`);
        }
    }

    async getRoomsByManager(manager_id: string) {
        try {
            const rooms = await Room.findAll({ where: { manager_id } });
            if (rooms.length === 0) {
                return null;
            }
            return rooms;
        } catch (error: any) {
            throw new Error(`Erro ao listar salas do prédio com ID ${manager_id}: ${error.message}`);
        }
    }

    async getRoomById(id: number) {
        try {
            const room = await Room.findByPk(id);
            if (!room) {
                // throw new Error(`Sala com ID ${id} não encontrada.`);
                return null;
            }
            return room;
        } catch (error: any) {
            throw new Error(`Erro ao buscar sala com ID ${id}: ${error.message}`);
        }
    }

    // Atualizar uma sala
    async updateRoom(id: number, updatedData: Partial<{ building_id: number, manager_id: string, name: string, schedule: string, workspace_config: string, equipments: string[] }>) {
        try {
            const room = await this.getRoomById(id);
            if (!room) {
                return null;
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
                return false;
            }
            await room.destroy();
            return true;
        } catch (error: any) {
            throw new Error(`Erro ao excluir sala com ID ${id}: ${error.message}`);
        }
    }

    // async getUsersByRoom(id: number): Promise<User[] | null> {
    //     try {
    //         const users = await UserRooms.findAll({ where: { roomId : id }, include: [User] });
    //         if (users.length === 0) {
    //             return null;
    //         }
    //         return users.map(users => users.get('User') as User);
    //     } catch (error: any) {
    //         throw new Error(`Erro ao listar usuários da sala com ID ${id}: ${error.message}`);
    //     }
    // }

}
