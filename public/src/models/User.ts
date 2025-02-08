import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
    id: string;
    name: string;
    permission: string;
    password: string;
}
export class User extends Model<UserAttributes, UserCreationAttributes> implements
UserAttributes {
    public id!: string;
    public name!: string;
    public permission!: string;
    public password!: string;
}
// Inicialize o modelo com os campos no banco
User.init(
    {
        id: {
            type: DataTypes.STRING(11),
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        permission: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
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
