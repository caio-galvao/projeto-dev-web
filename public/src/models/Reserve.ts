import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

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
        },
        workspace_id: {
            type: DataTypes.INTEGER,
        },
        room_id: {
            type: DataTypes.INTEGER,
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
