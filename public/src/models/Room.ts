import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { Building } from './Building';

interface RoomAttributes {
    id: number;
    building_id: number;
    manager_id: string;
    name: string;
    hours_of_operation: string;
    configuration: string;
    equipments: Array<string>;
}

interface RoomCreationAttributes extends RoomAttributes {}

export class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
    public id!: number;
    building_id!: number;
    public name!: string;
    public manager_id!: string;
    public hours_of_operation!: string;
    public configuration!: string;
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
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        manager_id: {
            type: DataTypes.STRING(14),
            references: {
                model: User,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        hours_of_operation: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        configuration: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        equipments: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },
        },
        {
        sequelize,
        tableName: "rooms",
        timestamps: false,
    }
);

Room.belongsTo(User, { foreignKey: 'user_id', as: 'manager' });
User.hasMany(Room, { foreignKey: 'user_id', as: 'userRooms' });

Room.belongsTo(Building, { foreignKey: 'building_id', as: 'infra' });
Building.hasMany(Room, { foreignKey: 'building_id', as: 'userBuildings' });
