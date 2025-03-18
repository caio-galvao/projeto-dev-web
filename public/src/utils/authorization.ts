import { WorkspaceService } from "../services/workspaceService";
import { RoomService } from "../services/roomService";
import { BuildingService } from "../services/buildingService";
import { CompanyService } from "../services/companyService";
import { Building } from "../models/Building";
import { Company } from "../models/Company";
import { Request } from "express";
import { Room } from "../models/Room";
import { Workspace } from "../models/Workspace";

const companyService = new CompanyService();
const buildingService = new BuildingService();
const roomService = new RoomService();
const workspaceService = new WorkspaceService();

export async function authorizeByCompanyId(req: Request, user: any): Promise<boolean> {
    if (user.role !== "ultra") {
        const company = await getCompanyById(Number(req.params.id)); 
        return company.manager_id === user.id;
    }
    return true;
}

export async function authorizeByCompanyIdInBody(req: Request, user: any): Promise<boolean> {
    if (user.role !== "ultra") {
        const { company_id } = req.body;
        const company = await getCompanyById(company_id); 
        return company.manager_id === user.id;
    }
    return true;
}

export async function authorizeByBuildingId(req: Request, user: any): Promise<boolean> {
    if (user.role !== "ultra") {
        const building = await getBuildingById(Number(req.params.id))
        const company = await getCompanyById(building.company_id)
        return company.manager_id === user.id;
    }
    return true;
}

export async function authorizeByBuildingIdInBody(req: Request, user: any): Promise<boolean> {
    if (user.role !== "ultra") {
        const { building_id } = req.body;
        const building = await getBuildingById(building_id)
        const company = await getCompanyById(building.company_id)
        return company.manager_id === user.id;
    }
    return true;
}

export async function authorizeByRoomId(req: Request, user: any): Promise<boolean> {
    if (user.role === "admin") {
        const room = await getRoomById(Number(req.params.id));
        return room.manager_id === user.id;
    }
    if (user.role === "master") {
        const room = await getRoomById(Number(req.params.id));
        const building = await getBuildingById(room.building_id)
        const company = await getCompanyById(building.company_id)
        return company.manager_id === user.id;
    };
    return true;
}

export async function authorizeByRoomUser(req: Request, user: any): Promise<boolean> {
    if (user.role === "admin") {
        const room = await getRoomById(Number(req.params.room_id));
        return room.manager_id === user.id;
    }
    if (user.role === "master") {
        const room = await getRoomById(Number(req.params.room_id));
        const building = await getBuildingById(room.building_id)
        const company = await getCompanyById(building.company_id)
        return company ? company.manager_id === user.id : false;
    };
    return true;
}

export async function authorizeByWorkspaceId(req: Request, user: any): Promise<boolean> {
    if (user.role === "admin") {
        const workspace = await getWorkspaceById(Number(req.params.id))
        const room = await getRoomById(workspace.room_id);
        return room.manager_id === user.id;
    }
    if (user.role === "master") {
        const workspace = await getWorkspaceById(Number(req.params.id))
        const room = await getRoomById(workspace.room_id);
        const building = await getBuildingById(room.building_id)
        const company = await getCompanyById(building.company_id)
        return company.manager_id === user.id;
    };
    return true;
}

async function getWorkspaceById(workspace_id: number): Promise<Workspace> {
    const workspace = await workspaceService.getOneWorkspace(workspace_id);
    if (!workspace) {
        const error: any = new Error( `Espaço de trabalho com ID ${workspace_id} não encontrado.`);
        error.status = 404;
        throw error;
    }
    return workspace;
}

async function getRoomById(room_id: number): Promise<Room> {
    const room = await roomService.getOneRoom(room_id);
    if (!room) {
        const error: any = new Error(`Sala com ID ${room_id} não encontrada.`);
        error.status = 404;
        throw error;
    }
    return room;
}

async function getBuildingById(building_id: number): Promise<Building> {
    const building = await buildingService.getOneBuilding(building_id);
    if (!building) {
        const error: any = new Error( `Prédio com ID ${building_id} não encontrado.`);
        error.status = 404;
        throw error;
    }
    return building;
}

async function getCompanyById(company_id: number): Promise<Company> {
    const company = await companyService.getOneCompany(company_id);
    if (!company) {
        const error: any = new Error(`Empresa com ID ${company_id} não encontrada.`);
        error.status = 404;
        throw error;
    }
    return company;
}