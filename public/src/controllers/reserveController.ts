import { ReserveService } from "../services/reserveService";
import { Request, Response } from "express"

export class ReserveController {
    private reserveService: ReserveService;

    constructor() {
        this.reserveService = new ReserveService();
    }

    async createReserve(req: Request, res: Response): Promise<void> {
        try {
            const {user_id, workspace_id, time } = req.body;

            if ( !user_id || !workspace_id || !time) {
                res.status(400).json({ message: "Dados inválidos. Todos os campos são obrigatórios." });
                return
            }
    
            const reserve = await this.reserveService.createReserve(user_id, workspace_id, time);

            if(!reserve) {
                res.status(409).json({ message: "Uma reserva o mesmo horário e espaço de trabalho já existe." });
                return;
            }

            res.status(201).json(reserve);
        } catch (error: any) {
            if (error.message === `Id do usuário inválido`) {
                res.status(400).json({message: error.message})
            } else if  (error.message === `Id do espaço de trabalho inválido`){
                res.status(400).json({message: error.message})
            } else {
                res.status(500).json({ message: "Erro ao criar a reserva", error: error.message });
            }
    }
    };
        
    async getReservesByWorkspace(req: Request, res: Response): Promise<void> {
        try {
            const { workspace_id } = req.params;
            const reserves = await this.reserveService.getReservesByWorkspace(Number(workspace_id));

            if (!reserves) {
                res.status(204).json({ message: "Não há reservas resgistrados" });
                return;
            }

            res.json(reserves);
        } catch (error: any) {
            if (error.message.startsWith('Espaco de trabalho com ID ')) {
                res.status(404).json({message: error.message})
            } else {
                res.status(500).json({ message: "Erro ao obter as reservas", error: error.message });
            }
        }
    };

    async getReservesByUser(req: Request, res: Response): Promise<void> {
        try {
            const { user_id } = req.params;
            const reserves = await this.reserveService.getReservesByUser(user_id);

            if (!reserves) {
                res.status(204).json({ message: "Não há reservas resgistrados" });
                return;
            }

            res.json(reserves);
        } catch (error: any) {
            if (error.message.startsWith('Usuário com ID ')) {
                res.status(404).json({message: error.message})
            } else {
                res.status(500).json({ message: "Erro ao obter as reservas", error: error.message });
            }
        }
    };
        
    async getOneReserve(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params; 
            const reserve = await this.reserveService.getOneReserve(Number(id));
    
            if (!reserve) {
                res.status(404).json({ message: `Reserva com ID ${id} não encontrada.` });
                return;
            }
    
            res.json(reserve);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao obter a reserva", error: error.message });
        }
    }
        
    async deleteOneReserve(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params; 
            const deleted = await this.reserveService.deleteOneReserve(Number(id));
    
            if (deleted) {
                res.status(204).json({ message: `Reserva com ID ${id} excluída com sucesso.` });
                return;
            } else {
                res.status(404).json({ message: `Reserva com ID ${id} não encontrada.` });
                return;
            }

        } catch (error: any) {
            res.status(500).json({ message: "Erro ao remover a reserva", error: error.message });
        }
    }

    
}

export default new ReserveController();
