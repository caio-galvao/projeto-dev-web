import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ReserveAttributes {
    user_id: string;
    workspace_id: number;
    room_id: number;
    time: string;
}

interface ReserveCreationAttributes extends ReserveAttributes {}

export class Reserve extends Model<ReserveAttributes, ReserveCreationAttributes> implements ReserveAttributes {
    public user_id!: string;
    public workspace_id!: number;
    public room_id!: number;
    public time!: string;
}
// Inicialize o modelo com os campos no banco
Reserve.init(
    {
        user_id: {
            type: DataTypes.STRING(11),
            primaryKey: true,
        },
        workspace_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        room_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        time: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        },
        {
        sequelize,
        tableName: "companies",
        timestamps: false,
    }
);
