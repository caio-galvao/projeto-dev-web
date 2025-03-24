import * as request from "supertest";
import app from "../../src/index";
import sequelize from "../../src/config/database";

let token: string;
let roomId: number;

beforeEach(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
  }

  const boss = {
    id: "123.456.789-00",
    name: "Carlos",
    password: "123",
    type: "master",
  };
  await request(app).post("/users").send(boss);

  const login = {
    cpf: "123.456.789-00",
    password: "123",
  };
  const loginResponse = await request(app).post("/auth/login").send(login);
  token = loginResponse.body.token;

  const newCompany = {
    name: "Empresa Teste",
    manager_id: boss.id,
    location: "Rua A, 123",
  };
  const companyResponse = await request(app)
    .post("/company")
    .send(newCompany)
    .set("Authorization", `Bearer ${token}`);
  const companyId = companyResponse.body.id;

  const newBuilding = {
    name: "Prédio Teste",
    company_id: companyId,
  };
  const buildingResponse = await request(app)
    .post("/building")
    .send(newBuilding)
    .set("Authorization", `Bearer ${token}`);
  const buildingId = buildingResponse.body.id;

  const newRoom = {
    building_id: buildingId,
    manager_id: boss.id,
    name: "Sala 1",
    schedule: "08:00-18:00",
    workspace_config: "1:2,2:2,3:2",
    equipments: ["Projetor", "Mesa", "Cadeiras"],
  };
  const roomResponse = await request(app)
    .post("/room")
    .send(newRoom)
    .set("Authorization", `Bearer ${token}`);
  roomId = roomResponse.body.id;
});


afterAll(async () => {
  await sequelize.close();
});

describe("WorkspaceController - getWorkspacesByRoom", () => {
  it("deve retornar status 200 e uma lista de espaços de trabalhos", async () => {
    const response = await request(app)
      .get(`/workspace/room/${roomId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          room_id: roomId,
          position: 1,
          equipments: [],
        }),
        expect.objectContaining({
          id: 2,
          room_id: roomId,
          position: 2,
          equipments: [],
        }),
        expect.objectContaining({
          id: 3,
          room_id: roomId,
          position: 3,
          equipments: [],
        }),
        expect.objectContaining({
          id: 4,
          room_id: roomId,
          position: 4,
          equipments: [],
        }),
        expect.objectContaining({
          id: 5,
          room_id: roomId,
          position: 5,
          equipments: [],
        }),
        expect.objectContaining({
          id: 6,
          room_id: roomId,
          position: 6,
          equipments: [],
        }),
      ])
    );
    expect(response.body).toHaveLength(6);
  });

  it("deve retornar status 404 quando a sala não for encontrada", async () => {
    const response = await request(app)
      .get(`/workspace/room/2`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Sala com ID 2 não encontrada."
    });
  });
});

describe("WorkspaceController - getWorkspaceById", () => {

  it("deve retornar status 200 e um espaço de trabalho existente", async () => {
    const expectedWorkspace = {
      id: 1,
      room_id: roomId,
      position: 1,
      equipments: [],
    };

    const response = await request(app)
      .get("/workspace/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedWorkspace);
  });

  it("deve retornar status 404 para espaço de trabalho não cadastrado", async () => {
    const response = await request(app)
      .get("/workspace/7")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Espaço de trabalho com ID 7 não encontrado."
    });
  });
});

describe("WorkspaceController - updateWorkspace", () => {
  it("deve editar espaço de trabalho com sucesso", async () => {
    const updateData = {
      room_id: roomId,
      position: 1,
      equipments: ["cadeira", "monitor"],
    };

    const updateResponse = await request(app)
      .put("/workspace/1")
      .send(updateData)
      .set("Authorization", `Bearer ${token}`);

    expect(updateResponse.status).toBe(201);
    expect(updateResponse.body).toEqual({
      id: 1,
      room_id: roomId,
      position: 1,
      equipments: ["cadeira", "monitor"],
    });

    const getResponse = await request(app)
      .get("/workspace/1")
      .set("Authorization", `Bearer ${token}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual({
      id: 1,
      room_id: roomId,
      position: 1,
      equipments: ["cadeira", "monitor"],
    });
  });

  it("deve retornar status 404 ao tentar editar espaço de trabalho não cadastrado", async () => {
    const updateData = {
      room_id: roomId,
      position: 1,
      equipments: ["cadeira", "monitor"],
    };

    const response = await request(app)
      .put("/workspace/7")
      .send(updateData)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Espaço de trabalho com id 7 não encontrado."
    });
  });

  it("deve retornar status 400 ao tentar editar um espaço de trabalho sem ID de sala.", async () => {
    const updateData = {
      position: 1,
      equipments: ["cadeira", "monitor"],
    };

    const response = await request(app)
      .put("/workspace/1")
      .send(updateData)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "O campo id da sala é obrigatório."
    });
  });

  it("deve retornar status 400 ao tentar editar um espaço de trabalho sem posição", async () => {
    const updateData = {
      room_id: roomId,
      equipments: ["cadeira", "monitor"],
    };

    const response = await request(app)
      .put("/workspace/1")
      .send(updateData)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "O campo posição é obrigatório."
    });
  });

  it("deve retornar status 400 ao tentar editar um espaço de trabalho sem equipamentos", async () => {
    const updateData = {
      room_id: roomId,
      position: 1,
    };

    const response = await request(app)
      .put("/workspace/1")
      .send(updateData)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "O campo equipamentos é obrigatório."
    });
  });

  it("deve retornar status 404 ao editar espaço de trabalho com sala não cadastrada", async () => {
    const updateData = {
      room_id: 2,
      position: 1,
      equipments: ["cadeira", "monitor"],
    };

    const response = await request(app)
      .put("/workspace/1")
      .send(updateData)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Id da sala não encontrado."
    });
  });

  it("deve retornar status 409 ao editar espaço de trabalho com a posição de outro espaço de trabalho na mesma sala", async () => {
    const updateData = {
      room_id: 1,
      position: 2,
      equipments: ["cadeira", "monitor"],
    };

    const response = await request(app)
      .put("/workspace/1")
      .send(updateData)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: "Posição 2 pertence a outro espaço de trabalho na mesma sala."
    });
  });

});


