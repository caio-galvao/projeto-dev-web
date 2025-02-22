import { Sequelize } from "sequelize";
import dotenv from "dotenv";

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
