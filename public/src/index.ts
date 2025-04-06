import express = require("express");
import * as dotenv from "dotenv";
import cors from "cors";
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

/*
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
*/

app.use('/auth', authRoutes);
app.use("/users", userRoutes); 
app.use("/company", companyRoutes);
app.use("/building", buildingRoutes);
app.use("/room", roomRoutes);
app.use("/workspace", workspaceRoutes);
app.use("/reserve", reserveRoutes);

export default app;

sequelize.sync({ alter: true }).then(() => {
    console.log("Banco de dados conectado!");
    app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
}).catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
});
