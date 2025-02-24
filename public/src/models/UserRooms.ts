// import { Model, DataTypes, Optional } from "sequelize";
// import  sequelize  from "../config/database";
// import { User } from "./User";
// import { Room } from "./Room";

// interface UserRoomsAttributes {
//     userId: string;
//     roomId: number;
// }

// interface UserRoomsCreationAttributes extends UserRoomsAttributes {}

// export class UserRooms extends Model<UserRoomsAttributes, UserRoomsCreationAttributes> implements UserRoomsAttributes {
//     userId!: string;
//     roomId!: number;
// }
// UserRooms.init(
//     {
//         userId: {
//             type: DataTypes.STRING(14),
//             primaryKey: true,
//         },
//         roomId: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//         },
//     },
//     {
//         sequelize,
//         tableName: "userrooms",
//         timestamps: false,
//     }
// );

// UserRooms.belongsTo(User, { foreignKey: 'userId' });
// UserRooms.belongsTo(Room, { foreignKey: 'roomId' });
