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
            const { id, name, room_id, manager_id } = req.body;

            if (!id || !name || !room_id || !manager_id) {
                res.status(400).json({ message: "Dados inválidos. Todos os campos são obrigatórios." });
                return
            }
    
            const room = await this.roomService.createRoom(id, name, room_id, manager_id);

            if(!room) {
                res.status(409).json({ message: "Uma sala com este nome já existe." });
                return;
            }

            res.status(201).json(room);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao criar o prédio", error: error.message });
    }
    };
        
    // async getRoomByCompany(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { company_id } = req.params;
    //         const rooms = await this.roomService.getRoomsByCompany(Number(company_id));

    //         if (!rooms) {
    //             res.status(204).json({ message: "Não há prédios resgistradas" });
    //             return;
    //         }

    //         res.json(rooms);
    //     } catch (error: any) {
    //         res.status(500).json({ message: "Erro ao obter os prédios", error: error.message });
    //     }
    // };
        
    // async getOneRoom(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { id } = req.params; 
    //         const room = await this.roomService.getOneRoom(Number(id));
    
    //         if (!room) {
    //             res.status(404).json({ message: "Prédio não encontrado" });
    //             return;
    //         }
    
    //         res.json(room);
    //     } catch (error: any) {
    //         res.status(500).json({ message: "Erro ao obter o prédio", error: error.message });
    //     }
    // }

    // async editOneRoom(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { id } = req.params;
    //         const { name, company_id } = req.body;

    //         if (!id || !name || !company_id ) {
    //             res.status(400).json({ message: "Dados inválidos. Todos os campos são obrigatórios." });
    //             return
    //         }
    
    //         const room = await this.roomService.editOneRoom(Number(id), name, company_id);

    //         if(!room) {
    //             res.status(404).json({ message: "Prédio não encontrado." });
    //             return;
    //         }

    //         res.status(201).json(room);
    //     } catch (error: any) {
    //         res.status(500).json({ message: "Erro ao editar o prédio", error: error.message });
    // }
    // };
        
    // async deleteOneRoom(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { id } = req.params; 
    //         const deleted = await this.roomService.deleteOneRoom(Number(id));
    
    //         if (deleted) {
    //             res.status(200).json({ message: `Prédio com ID ${id} excluído com sucesso.` });
    //             return;
    //         } else {
    //             res.status(404).json({ message: `Prédio com ID ${id} não encontrado.` });
    //             return;
    //         }

    //     } catch (error: any) {
    //         res.status(500).json({ message: "Erro ao remover o prédio", error: error.message });
    //     }
    // }

    
}

export default new RoomController();
