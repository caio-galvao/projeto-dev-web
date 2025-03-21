import { Model, DataTypes, Optional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

interface CompanyAttributes {
    id: number;
    name: string;
    manager_id: string;
    location: string;
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, "id"> {}

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
            type: DataTypes.STRING(14),
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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

Company.belongsTo(User, { foreignKey: 'boss_id', as: 'boss' });
User.hasMany(Company, { foreignKey: 'boss_id', as: 'managedCompanies' });
