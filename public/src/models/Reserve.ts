import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User'
import { Workspace } from './Workspace'
import { Room } from './Room'

interface ReserveAttributes {
    id: number;
    user_id: string;
    workspace_id: number;
    room_id: number;
    time: string;
}

interface ReserveCreationAttributes extends ReserveAttributes {}

export class Reserve extends Model<ReserveAttributes, ReserveCreationAttributes> implements ReserveAttributes {
    public id!: number;
    public user_id!: string;
    public workspace_id!: number;
    public room_id!: number;
    public time!: string;
}
// Inicialize o modelo com os campos no banco
Reserve.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.STRING(14),
            references: {
                model: User,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        workspace_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Workspace,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        // TODO: Analisar necessidade de Room, uma vez que ja tem workspace
        room_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Room,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        time: {
            type: DataTypes.STRING,
        },
        },
        {
        sequelize,
        tableName: "companies",
        timestamps: false,
    }
);

Reserve.belongsTo(User, { foreignKey: 'user_id', as: 'allocator' });
User.hasMany(Reserve, { foreignKey: 'user_id', as: 'userReserve' });

Reserve.belongsTo(Workspace, { foreignKey: 'workspace_id', as: 'ocupation' });
Workspace.hasOne(Reserve, { foreignKey: 'workspace_id', as: 'workspaceReserve' });

Reserve.belongsTo(Room, { foreignKey: 'room_id', as: 'infra' });
Room.hasMany(Reserve, { foreignKey: 'room_id', as: 'roomReserve' });
