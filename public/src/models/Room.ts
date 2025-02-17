import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface RoomAttributes {
    id: number;
    name: string;
    manager_id: string;
    location: string;
    hours_of_operation: string;
    configuration: string;
    equipments: Array<string>;
}

interface RoomCreationAttributes extends RoomAttributes {}

export class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
    public id!: number;
    public name!: string;
    public manager_id!: string;
    public location!: string;
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        manager_id: {
            type: DataTypes.STRING(11),
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hours_of_operation: {
            type: DataTypes.STRING,
        },
        configuration: {
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
