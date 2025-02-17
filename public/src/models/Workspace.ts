import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WorkspaceAttributes {
    id: number;
    user_id: string;
    room_id: number;
    time: string;
}

interface WorkspaceCreationAttributes extends WorkspaceAttributes {}

export class Workspace extends Model<WorkspaceAttributes, WorkspaceCreationAttributes> implements WorkspaceAttributes {
    public id!: number;
    public user_id!: string;
    public room_id!: number;
    public time!: string;
}
// Inicialize o modelo com os campos no banco
Workspace.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.STRING(11),
        },
        room_id: {
            type: DataTypes.INTEGER,
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        },
        {
        sequelize,
        tableName: "workspaces",
        timestamps: false,
    }
);
