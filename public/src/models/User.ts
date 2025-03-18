import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
// import { Room } from './Room';

interface UserAttributes {
    id: string;
    name: string;
    password: string;
    type: string;
}

interface UserCreationAttributes extends UserAttributes {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public password!: string;
    public type!: string;
}
// Inicialize o modelo com os campos no banco
User.init(
    {
        id: {
            type: DataTypes.STRING(14),
            primaryKey: true,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        },
        {
        sequelize,
        tableName: "users",
        timestamps: false,
    }
);

// User.belongsToMany(Room, { through: "UserRooms" });
// Room.belongsToMany(User, { through: "UserRooms" });
