import express from "express";
import * as dotenv from "dotenv";
import sequelize from "./config/database";
import { userRoutes } from "./routes/userRoutes";
import { companyRoutes } from "./routes/companyRoutes";
import { buildingRoutes } from "./routes/buildingRoutes";
import { roomRoutes } from "./routes/roomRoutes";
import { workspaceRoutes } from "./routes/workspaceRoutes";
import { reserveRoutes } from "./routes/reserveRoutes";
import authRoutes from './routes/authRoutes';

    console.log("🚀 Servidor rodando...");

    dotenv.config();

    const app = express();
    app.use(express.json());

    app.use('/auth', authRoutes);
    app.use("/users", userRoutes); 
    app.use("/company", companyRoutes);
    app.use("/building", buildingRoutes);
    app.use("/room", roomRoutes);
    app.use("/workspace", workspaceRoutes);
    app.use("/reserve", reserveRoutes);

    // Testando a conexão e inicializando o servidor
    sequelize.sync({ force: true }).then(() => {
        console.log("Banco de dados conectado!");
        app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
    }).catch((error) => {
        console.error("Erro ao conectar ao banco de dados:", error);
    });