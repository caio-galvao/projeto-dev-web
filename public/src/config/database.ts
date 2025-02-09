import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

console.log("DB_DIALECT:", process.env.DB_DIALECT);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);
console.log("DB_NAME:", process.env.DB_NAME);

dotenv.config();

const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT as "postgres" | "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: false,
}); 

sequelize.authenticate()
  .then(() => console.log("📌 Conectado ao banco com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar ao banco:", err));


export default sequelize;
