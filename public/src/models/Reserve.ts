import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User'
import { Workspace } from './Workspace'

interface ReserveAttributes {
    id: number;
    user_id: string;
    workspace_id: number;
    time: string;
}

interface ReserveCreationAttributes extends Optional<ReserveAttributes, 'id'> {}

export class Reserve extends Model<ReserveAttributes, ReserveCreationAttributes> implements ReserveAttributes {
    public id!: number;
    public user_id!: string;
    public workspace_id!: number;
    public time!: string;
}
// Inicialize o modelo com os campos no banco
Reserve.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
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
Workspace.hasMany(Reserve, { foreignKey: 'workspace_id', as: 'workspaceReserve' });
