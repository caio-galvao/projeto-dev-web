import { Room } from "../models/Room";
import { RoomUser } from "../models/RoomUser";
import { Op } from 'sequelize';
import { Building } from "../models/Building";
import { User } from "../models/User";

export class RoomRepository {
    async createRoom(building_id: number, manager_id: string, name: string, schedule: string, workspace_config: string, equipments: Array<string>) {
        try {
            const existingRoom = await Room.findOne({ where: { name } }) 
            if (existingRoom) {
                return null;
            }

            const room = await Room.create({
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
            const buildingExists = await Building.findByPk(building_id);
            if (!buildingExists) {
                return null;
            }
            const rooms = await Room.findAll({ where: { building_id } });
            return rooms;
        } catch (error: any) {
            throw new Error(`Erro ao listar salas do prédio com ID ${building_id}: ${error.message}`);
        }
    }

    async getRoomsByManager(manager_id: string) {
        try {
            const manager = await User.findByPk(manager_id);
            if (!manager) {
                return null;
            }
            const rooms = await Room.findAll({ where: { manager_id } });
            return rooms;
        } catch (error: any) {
            throw new Error(`Erro ao listar salas do prédio com ID ${manager_id}: ${error.message}`);
        }
    }

    async getRoomById(id: number) {
        try {
            const room = await Room.findByPk(id);
            if (!room) {
                return null;
            }
            return room;
        } catch (error: any) {
            throw new Error(`Erro ao buscar sala com ID ${id}: ${error.message}`);
        }
    }

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

    async getUsersByRoom(id: number): Promise<User[] | null> {
        try {
            const room_users = await RoomUser.findAll({ where: { room_id : id } });
            if (room_users.length === 0) {
                return null;
            }

            const userIds = room_users.map(entry => entry.getDataValue('user_id'));
            const users = await User.findAll({ where: { id: { [Op.in]: userIds } } });

            return users;        
        } catch (error: any) {
            throw new Error(`Erro ao listar usuários da sala com ID ${id}: ${error.message}`);
        }
    }

    async addUserInRoom(room_id: number, user_id: string): Promise<RoomUser | null> {
        try {
            const existingUserRoom = await RoomUser.findOne({ where: { room_id, user_id } }) 
            if (existingUserRoom) {
                return null;
            }
            const room_user = await RoomUser.create({room_id, user_id});
            return room_user;
        } catch (error: any) {
            throw new Error(`Erro ao adicionar usuário com ID ${user_id} da sala com ID ${room_id}: ${error.message}`);
        }
    }

    async deleteUserFromRoom(room_id: number, user_id: string) {
        try {
            const room_user = await RoomUser.findOne({ where: { room_id, user_id } }) 
            if (!room_user) {
                return false;
            }
            await room_user.destroy();
            return true;
        } catch (error: any) {
            throw new Error(`Erro ao excluir usuário com ID ${user_id} da sala com ID ${room_id}: ${error.message}`);
        }
    }
}
