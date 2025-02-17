import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CompanyAttributes {
    id: number;
    name: string;
    manager_id: string;
    location: string;
}

interface CompanyCreationAttributes extends CompanyAttributes {}

export class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
    public id!: number;
    public name!: string;
    public manager_id!: string;
    public location!: string;
}
// Inicialize o modelo com os campos no banco
Company.init(
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
        },
        {
        sequelize,
        tableName: "companies",
        timestamps: false,
    }
);
