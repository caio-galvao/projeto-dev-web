import express from "express";
import * as dotenv from "dotenv";
import sequelize from "./config/database";
import { userRoutes } from "./routes/userRoutes";
import { companyRoutes } from "./routes/companyRoutes";
import { buildingRoutes } from "./routes/buildingRoutes";


    console.log("🚀 Servidor rodando...");

    dotenv.config();

    const app = express();
    app.use(express.json());

    app.use("/users", userRoutes); 
    app.use("/company", companyRoutes);
    app.use("/building", buildingRoutes);  


    // Testando a conexão e inicializando o servidor
    sequelize.sync({ force: true }).then(() => {
        console.log("Banco de dados conectado!");
        app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
    }).catch((error) => {
        console.error("Erro ao conectar ao banco de dados:", error);
    });
