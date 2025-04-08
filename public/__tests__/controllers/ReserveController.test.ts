import * as request from "supertest";
import app from "../../src/index";
import sequelize from "../../src/config/database";

let token: string;

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

  const login_master = {
    cpf: "123.456.789-00",
    password: "123",
  };
  const loginResponseMaster = await request(app).post("/auth/login").send(login_master);
  const token_master = loginResponseMaster.body.token;

  const user = {
    id: "777.465.769-20",
    name: "João",
    password: "123",
    type: "comum",
  };
  await request(app).post("/users").send(user);

  const login_user = {
    cpf: "777.465.769-20",
    password: "123",
  };
  const loginResponseUser = await request(app).post("/auth/login").send(login_user);
  token = loginResponseUser.body.token;

  const newCompany = {
    name: "Empresa Teste",
    manager_id: boss.id,
    location: "Rua A, 123",
  };
  const companyResponse = await request(app)
    .post("/company")
    .send(newCompany)
    .set("Authorization", `Bearer ${token_master}`);
  const companyId = companyResponse.body.id;

  const newBuilding = {
    name: "Prédio Teste",
    company_id: companyId,
  };
  const buildingResponse = await request(app)
    .post("/building")
    .send(newBuilding)
    .set("Authorization", `Bearer ${token_master}`);
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
    .set("Authorization", `Bearer ${token_master}`);
  const roomId = roomResponse.body.id;

  await request(app).post(`/room/${roomId}/user/${user.id}`).set("Authorization", `Bearer ${token_master}`)
});


afterAll(async () => {
  await sequelize.close();
});


describe("ReserveController - createReserve", () => {
  it("deve retornar status 201 e criar uma nova reserva", async () => {
    const reserve = {
      user_id: "777.465.769-20",
      workspace_id: 1,
      time: "05/02/2025-10:00",
    };

    const response = await request(app)
      .post("/reserve")
      .send(reserve)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      user_id: "777.465.769-20",
      workspace_id: 1,
      time: "05/02/2025-10:00",
    });
  });

  it("deve retornar status 409 ao tentar criar uma reserva no mesmo horário e espaço de trabalho que outra já existente", async () => {
    const reserve = {
      user_id: "777.465.769-20",
      workspace_id: 1,
      time: "05/02/2025-10:00",
    };

    await request(app)
      .post("/reserve")
      .send(reserve)
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .post("/reserve")
      .send(reserve)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: "Uma reserva no mesmo horário e espaço de trabalho já existe.",
    });
  });

  it("deve retornar status 400 ao tentar criar reserva sem ID do usuário", async () => {
    const reserve = {
      workspace_id: 1,
      time: "05/02/2025-10:00",
    };

    const response = await request(app)
      .post("/reserve")
      .send(reserve)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "O campo id do usuário é obrigatório.",
    });
  });

  it("deve retornar status 400 ao tentar criar reserva sem ID do espaço de trabalho", async () => {
    const reserve = {
      user_id: "777.465.769-20",
      time: "05/02/2025-10:00",
    };

    const response = await request(app)
      .post("/reserve")
      .send(reserve)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "O campo id do espaço de trabalho é obrigatório.",
    });
  });

  it("deve retornar status 400 ao tentar criar reserva sem horário", async () => {
    const reserve = {
      user_id: "777.465.769-20",
      workspace_id: 1,
    };

    const response = await request(app)
      .post("/reserve")
      .send(reserve)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "O campo horário é obrigatório.",
    });
  });

  it("deve retornar status 404 ao tentar criar uma reserva com espaço de trabalho não cadastrado", async () => {
    const reserve = {
      user_id: "777.465.769-20",
      workspace_id: 7,
      time: "05/02/2025-10:00",
    };

    const response = await request(app)
      .post("/reserve")
      .send(reserve)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Espaço de trabalho com id 7 não encontrado.",
    });
  });

  it("deve retornar status 403 ao tentar criar uma reserva com usuário diferente do usuário fez a operação", async () => {
    const reserve = {
      user_id: "123.456.789-00",
      workspace_id: 1,
      time: "05/02/2025-10:00",
    };

    const response = await request(app)
      .post("/reserve")
      .send(reserve)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Access denied. Attribute check failed.",
    });
  });

  it("deve retornar status 403 ao tentar criar uma reserva com usuário não cadastrado naquela sala", async () => {
    const user = {
      id: "111.111.111-11",
      name: "Ana",
      password: "123",
      type: "comum",
    };
    await request(app).post("/users").send(user);
  
    const login = {
      cpf: "111.111.111-11",
      password: "123",
    };
    const loginResponse = await request(app).post("/auth/login").send(login);
    const token_user = loginResponse.body.token;
    
    const reserve = {
      user_id: "111.111.111-11",
      workspace_id: 1,
      time: "05/02/2025-10:00",
    };

    const response = await request(app)
      .post("/reserve")
      .send(reserve)
      .set("Authorization", `Bearer ${token_user}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Access denied. Attribute check failed.",
    });
  });
});

describe("ReserveController - getReserveById", () => {
  it("deve retornar status 200 ao obter reserva existente", async () => {
    const reserve = {
      user_id: "777.465.769-20",
      workspace_id: 1,
      time: "05/02/2025-10:00",
    };

    await request(app)
      .post("/reserve")
      .send(reserve)
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .get("/reserve/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      user_id: "777.465.769-20",
      workspace_id: 1,
      time: "05/02/2025-10:00",
    });
  });

  it("deve retornar status 404 ao tentar obter reserva não cadastrada", async () => {
    const response = await request(app)
      .get("/reserve/2")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Reserva com ID 2 não encontrada.",
    });
  });
});

describe("ReserveController - getReservesByUser", () => {
  it("deve retornar status 200 ao buscar todas as reservas de um usuário", async () => {
    const reserve = {
      user_id: "777.465.769-20",
      workspace_id: 1,
      time: "05/02/2025-10:00",
    };

    await request(app)
      .post("/reserve")
      .send(reserve)
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .get("/reserve/user/777.465.769-20")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        user_id: "777.465.769-20",
        workspace_id: 1,
        time: "05/02/2025-10:00",
      },
    ]);
  });

  it("deve retornar status 204 ao buscar todas as reservas de um usuário sem nenhuma reserva registrada", async () => {
    const response = await request(app)
      .get("/reserve/user/777.465.769-20")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("deve retornar status 404 ao tentar buscar por todos as reservas de um usuário não cadastrado", async () => {
    const response = await request(app)
      .get("/reserve/user/000.000.000-00")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Usuário com ID 000.000.000-00 não encontrado.",
    });
  });
});

describe("ReserveController - getReservesByWorkspace", () => {
  it("deve retornar status 200 ao buscar todas as reservas de um espaço de trabalho", async () => {
    const reserve = {
      user_id: "777.465.769-20",
      workspace_id: 1,
      time: "05/02/2025-10:00",
    };

    await request(app)
      .post("/reserve")
      .send(reserve)
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .get("/reserve/workspace/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        user_id: "777.465.769-20",
        workspace_id: 1,
        time: "05/02/2025-10:00",
      },
    ]);
  });

  it("deve retornar status 204 ao buscar todas as reservas de um espaço de trabalho sem nenhuma reserva registrada", async () => {
    const response = await request(app)
      .get("/reserve/workspace/2")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("deve retornar status 404 ao tentar buscar por todas as reservas de um espaço de trabalho não cadastrado", async () => {
    const response = await request(app)
      .get("/reserve/workspace/7")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Espaço de trabalho com ID 7 não encontrado.",
    });
  });
});

describe("ReserveController - deleteReserve", () => {
  it("deve retornar status 204 ao deletar reserva existente", async () => {
    const reserve = {
      user_id: "777.465.769-20",
      workspace_id: 1,
      time: "05/02/2025-10:00",
    };

    await request(app)
      .post("/reserve")
      .send(reserve)
      .set("Authorization", `Bearer ${token}`);

    const deleteResponse = await request(app)
      .delete("/reserve/1")
      .set("Authorization", `Bearer ${token}`);
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app)
      .get("/reserve/1")
      .set("Authorization", `Bearer ${token}`);
    expect(getResponse.status).toBe(404);
    expect(getResponse.body).toEqual({
      message: "Reserva com ID 1 não encontrada."
    });
  });

  it("deve retornar 404 ao tentar deletar reserva não cadastrada", async () => {
    const response = await request(app)
      .delete("/reserve/2")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Reserva com id 2 não encontrada."
    });
  });
});





