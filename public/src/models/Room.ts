import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Building } from './Building'
import { User } from './User'

interface RoomAttributes {
    id: number;
    building_id: number;
    manager_id: string;
    name: string;
    scheduler: string;
    workspace_config: string;
    equipments: Array<string>;
}

interface RoomCreationAttributes extends RoomAttributes {}

export class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
    public id!: number;
    public building_id!: number;
    public manager_id!: string;
    public name!: string;
    public scheduler!: string;
    public workspace_config!: string;
    public equipments!: Array<string>;
}
// Inicialize o modelo com os campos no banco
Room.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        building_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Building,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        manager_id: {
            type: DataTypes.STRING(14),
            references: {
                model: User,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        scheduler: {
            type: DataTypes.STRING,
        },
        workspace_config: {
            type: DataTypes.STRING,
        },
        equipments: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        },
        {
        sequelize,
        tableName: "rooms",
        timestamps: false,
    }
);

Room.belongsTo(User, { foreignKey: 'user_id', as: 'manager' });
User.hasMany(Room, { foreignKey: 'user_id', as: 'managerRoom' });

Room.belongsTo(Building, { foreignKey: 'building_id', as: 'infra' });
Building.hasMany(Room, { foreignKey: 'building_id', as: 'userBuildings' });


