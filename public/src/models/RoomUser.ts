import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { Room } from './Room';

interface RoomUserAttributes {
    room_id: number;
    user_id: string;
}

interface RoomUserCreationAttributes extends RoomUserAttributes {}

export class RoomUser extends Model<RoomUserAttributes, RoomUserCreationAttributes> implements RoomUserAttributes {
    public room_id!: number;
    public user_id!: string;
}

RoomUser.init(
    {
        room_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Room,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        user_id: {
            type: DataTypes.STRING(14),
            primaryKey: true,
            references: {
                model: User,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        },
        {
        sequelize,
        tableName: 'room_user',
        timestamps: false,
    }
);

Room.belongsToMany(User, { through: RoomUser, foreignKey: 'room_id', as: 'users' });
User.belongsToMany(Room, { through: RoomUser, foreignKey: 'user_id', as: 'rooms' });