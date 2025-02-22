import { Model, DataTypes, Optional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import { Company } from './Company';

interface BuildingAttributes {
    id: number;
    name: string;
    company_id: number
}

interface BuildingCreationAttributes extends Optional<BuildingAttributes, "id"> {}


export class Building extends Model<BuildingAttributes, BuildingCreationAttributes> implements BuildingAttributes {
    public id!: number;
    public name!: string;
    public company_id!: number;
}
// Inicialize o modelo com os campos no banco
Building.init(
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
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Company,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        },
        {
        sequelize,
        tableName: "buildings",
        timestamps: false,
    }
);

Building.belongsTo(Company, { foreignKey: 'company_id', as: 'manager' });
Company.hasMany(Building, { foreignKey: 'company_id', as: 'companyBuildings' });
