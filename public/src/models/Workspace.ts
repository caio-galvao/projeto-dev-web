import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Room } from "./Room";

interface WorkspaceAttributes {
    id: number;
    room_id: number;
    position: number;
    equipments: Array<string>;
}

interface WorkspaceCreationAttributes extends WorkspaceAttributes {}

export class Workspace extends Model<WorkspaceAttributes, WorkspaceCreationAttributes> implements WorkspaceAttributes {
    public id!: number;
    public room_id!: number;
    public position!: number;
    public equipments!: Array<string>;
}
// Inicialize o modelo com os campos no banco
Workspace.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        room_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Room,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        position: {
            type: DataTypes.INTEGER
        },
        equipments: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        },
        {
        sequelize,
        tableName: "workspaces",
        timestamps: false,
    }
);

Workspace.belongsTo(Room, { foreignKey: 'room_id', as: 'infra' });
Room.hasMany(Workspace, { foreignKey: 'room_id', as: 'roomWorkspace' });
