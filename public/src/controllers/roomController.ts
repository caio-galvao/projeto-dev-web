import { RoomService } from "../services/roomService";
import { Request, Response } from "express"

export class RoomController {
    private roomService: RoomService;

    constructor() {
        this.roomService = new RoomService();
    }

    //app.post("/room", async (req, res) =>

    async createRoom(req: Request, res: Response): Promise<void> {
        try {
            const { building_id, manager_id, name, schedule, workspace_config, equipments } = req.body;
            if (!building_id || !manager_id || !name || !schedule || !workspace_config || !equipments) {
                res.status(400).json({ message: "Dados inválidos. Todos os campos são obrigatórios." });
                return;
            }
    
            const room = await this.roomService.createRoom(building_id, manager_id, name, schedule, workspace_config, equipments );

            if(!room) {
                res.status(409).json({ message: "Uma sala com este nome já existe." });
                return;
            }

            res.status(201).json(room);
        } catch (error: any) {

            if (error.message === "Id do prédio não encontrado") {
                res.status(404).json({ message: error.message });
                return;
            }
            if (error.message === "Id do gerente não encontrado") {
                res.status(404).json({ message: error.message });
                return;
            }

            res.status(500).json({ message: "Erro ao criar a sala", error: error.message });
    }
    };

    //app.get("/building/:building_id", (req, res) =>
        
    async getRoomsByBuilding(req: Request, res: Response): Promise<void> {
        try {
            const { building_id } = req.params;
            const rooms = await this.roomService.getRoomsByBuilding(Number(building_id));

            if (isNaN(Number(building_id))) {
                res.status(400).json({ error: "O ID do prédio deve ser um número." });
                return 
            }

            if (!rooms) {

                res.status(404).json({ message: "Prédio não encontrado" });
                return;
            }
            if (rooms.length === 0) {
                res.status(204).json({ message: "Não há salas resgistradas" }); 

                return;
            }

            res.json(rooms);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao obter as salas", error: error.message });
        }
    };

    // app.get("/user/:manager_id", (req, res) =>
    // TODO
    async getRoomsByManager(req: Request, res: Response): Promise<void> {
        try {
            const { manager_id } = req.params;
            const rooms = await this.roomService.getRoomsByManager(manager_id);

            if (!rooms) {
                res.status(404).json({ message: "Gerente não encontrado" });
                return;
            }
            if (rooms.length === 0) {
                res.status(204).json({ message: "Não há salas resgistradas para este gerente" });
                return;
            }

            res.json(rooms);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao obter as salas", error: error.message });
        }
    };

    //app.get("/:id", (req, res) =>
        
    async getOneRoom(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const rooms = await this.roomService.getOneRoom(Number(id));

            if (isNaN(Number(id))) {
                res.status(400).json({ error: "O ID da sala deve ser um número" });
                return 
            }

            if (!rooms) {
                res.status(404).json({ message: `Sala com ID ${id} não encontrada`});
                return;
            }

            res.json(rooms);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao obter a sala", error: error.message });
        }
    };

    //app.put("/:id", (req, res) =>

    async editOneRoom(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { building_id, manager_id, name, schedule, workspace_config, equipments } = req.body;

            if (!building_id || !manager_id || !name || !schedule || !workspace_config || !equipments ) {
                res.status(400).json({ message: "Dados inválidos. Todos os campos são obrigatórios" });
                return
            }
    
            const room = await this.roomService.editOneRoom(Number(id), building_id, manager_id, name, schedule, workspace_config, equipments);

            if(!room) {
                res.status(404).json({ message: `Sala com ID ${id} não encontrada` });
                return;
            }

            res.status(201).json(room);
        } catch (error: any) {
            if (error.message === "Id do prédio não encontrado") {
                res.status(404).json({ message: error.message });
                return;
            }
            if (error.message === "Id do gerente não encontrado") {
                res.status(404).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Erro ao editar a sala", error: error.message });
    }
    };
    
    //app.delete("/:id", (req, res) =>
    
    async deleteOneRoom(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params; 
            const deleted = await this.roomService.deleteOneRoom(Number(id));
    
            if (deleted) {
                res.status(204).json({ message: `Sala com ID ${id} excluída com sucesso.` });
                return;
            } else {
                res.status(404).json({ message: `Sala com ID ${id} não encontrada.` });
                return;
            }

        } catch (error: any) {
            res.status(500).json({ message: "Erro ao remover o prédio", error: error.message });
        }
    }
}

export default new RoomController();
