import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WorkspaceAttributes {
    id: number;
    room_id: number;
    equipments: Array<string>;
}

interface WorkspaceCreationAttributes extends WorkspaceAttributes {}

export class Workspace extends Model<WorkspaceAttributes, WorkspaceCreationAttributes> implements WorkspaceAttributes {
    public id!: number;
    public room_id!: number;
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
