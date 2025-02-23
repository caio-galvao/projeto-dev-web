import { WorkspaceService } from "../services/workspaceService";
import { Request, Response } from "express"

export class WorkspaceController {
    private workspaceService: WorkspaceService;

    constructor() {
        this.workspaceService = new WorkspaceService();
    }
        
    async getWorkspacesByRoom(req: Request, res: Response): Promise<void> {
        try {
            const { room_id } = req.params;
            const workspaces = await this.workspaceService.getWorkspacesByRoom(Number(room_id));

            if (!workspaces) {
                res.status(204).json({ message: "Não há espaços de trabalho resgistrados" });
                return;
            }

            res.json(workspaces);
        } catch (error: any) {
            if (error.message.startsWith('Sala com ID ')) {
                res.status(404).json({message: error.message})
            } else {
                res.status(500).json({ message: "Erro ao obter os espaços de trabalho", error: error.message });
            }
        }
    };
        
    async getOneWorkspace(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params; 
            const workspace = await this.workspaceService.getOneWorkspace(Number(id));
    
            if (!workspace) {
                res.status(404).json({ message: `Espaço de trabalho com ID ${id} não encontrado.` });
                return;
            }
    
            res.json(workspace);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao obter o espaço de trabalho", error: error.message });
        }
    }

    async editOneWorkspace(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { room_id, position, equipments } = req.body;

            if (!id || !room_id || !position || !equipments ) {
                res.status(400).json({ message: "Dados inválidos. Todos os campos são obrigatórios." });
                return
            }
    
            const workspace = await this.workspaceService.editOneWorkspace(Number(id), room_id, position, equipments);

            if(!workspace) {
                res.status(404).json({ message: `Espaço de trabalho com ID ${id} não encontrado.` });
                return;
            }

            res.status(201).json(workspace);
        } catch (error: any) {
            if (error.message === `Id da sala inválido`) {
                res.status(400).json({message: error.message})
            } else {
                res.status(500).json({ message: "Erro ao editar o espaço de trabalho", error: error.message });
            }
    }
    };
}

export default new WorkspaceController();
