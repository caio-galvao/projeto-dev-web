import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

const databaseName =
  process.env.NODE_ENV === "test" ? process.env.DB_NAME_TEST : process.env.DB_NAME;

const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT as "postgres" | "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: databaseName,
    logging: false,
}); 

sequelize.authenticate()
  .then(() => console.log(`📌 Conectado ao banco: ${databaseName}`))
  .catch((err) => console.error("❌ Erro ao conectar ao banco:", err));

export default sequelize;
