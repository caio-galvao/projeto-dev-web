import * as request from "supertest";
import app from "../../src/index";
import sequelize from "../../src/config/database";

beforeEach(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
  }
});

afterAll(async () => {
  await sequelize.close();
});

describe("CompanyController - createCompany", () => {
  it("deve retornar status 201 e criar uma nova empresa", async () => {
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

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const newCompany = {
      name: "Empresa Teste",
      manager_id: "123.456.789-00",
      location: "Rua A, 123",
    };

    const response = await request(app)
      .post("/company")
      .send(newCompany)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: "Empresa Teste",
        manager_id: "123.456.789-00",
        location: "Rua A, 123",
      })
    );
  });

  it("deve retornar status 400 ao tentar criar uma empresa com um nome já existente", async () => {
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
  
    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;
  
    const company = {
      name: "Empresa Teste",
      manager_id: "123.456.789-00",
      location: "Rua A, 123",
    };
  
    const response_create = await request(app)
      .post("/company")
      .send(company)
      .set("Authorization", `Bearer ${token}`);
  
    expect(response_create.status).toBe(201);
  
    const response_duplicate = await request(app)
      .post("/company")
      .send(company)
      .set("Authorization", `Bearer ${token}`);
  
    expect(response_duplicate.status).toBe(409);
    expect(response_duplicate.body).toEqual({
      message: "Uma empresa com este nome já existe.",
    });
  });

  it("deve retornar status 400 ao tentar criar uma empresa sem nome", async () => {
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

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const invalidCompany = {
      manager_id: "123.456.789-00",
      location: "Rua A, 123",
    };

    const response = await request(app)
      .post("/company")
      .send(invalidCompany)
      .set("Authorization", `Bearer ${token}`);


    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "O campo nome é obrigatório.",
    });
  });

  it("deve retornar status 400 ao tentar criar uma empresa sem id de gerente", async () => {
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
  
    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;
  
    const invalidCompany = {
      name: "Empresa Teste",
      location: "Rua A, 123",
    };
  
    const response = await request(app)
      .post("/company")
      .send(invalidCompany)
      .set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "O campo id do gerente é obrigatório.",
    });
  });
  
  it("deve retornar status 400 ao tentar criar uma empresa sem localização", async () => {
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
  
    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;
  
    const invalidCompany = {
      name: "Empresa Teste",
      manager_id: "123.456.789-00",
    };
  
    const response = await request(app)
      .post("/company")
      .send(invalidCompany)
      .set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "O campo localização é obrigatório.",
    });
  });

});

describe("CompanyController - getOneCompany", () => {
  it("deve retornar status 200 e os dados da empresa quando ela existir", async () => {
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

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const newCompany = {
      name: "Empresa Teste",
      manager_id: "123.456.789-00",
      location: "Rua A, 123",
    };

    const response_create = await request(app)
      .post("/company")
      .send(newCompany)
      .set("Authorization", `Bearer ${token}`);

    // expect(response_create.status).toBe(201);

    const companyId = response_create.body.id;
    const response = await request(app)
      .get(`/company/${companyId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: companyId,
        name: "Empresa Teste",
        manager_id: "123.456.789-00",
        location: "Rua A, 123",
      })
    );
  });

  it("deve retornar status 404 quando a empresa não existir", async () => {
    const boss = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
      type: "comum",
    };

    await request(app).post("/users").send(boss);

    const login = {
      cpf: "123.456.789-00",
      password: "123",
    };

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const response = await request(app)
      .get("/company/999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Empresa com id 999 não encontrada.",
    });
  });
});

describe("CompanyController - editOneCompany", () => {
  it("deve retornar status 200 e atualizar os dados da empresa com sucesso", async () => {
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

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const newCompany = {
      name: "Empresa Teste",
      manager_id: "123.456.789-00",
      location: "Rua A, 123",
    };

    const response_create = await request(app)
      .post("/company")
      .send(newCompany)
      .set("Authorization", `Bearer ${token}`);

    expect(response_create.status).toBe(201);

    const companyId = response_create.body.id;

    const updatedCompany = {
      name: "Empresa Atualizada",
      manager_id: "123.456.789-00",
      location: "Rua B, 456",
    };

    const response_update = await request(app)
      .put(`/company/${companyId}`)
      .send(updatedCompany)
      .set("Authorization", `Bearer ${token}`);

    expect(response_update.status).toBe(201);
    expect(response_update.body).toEqual(
      expect.objectContaining({
        id: companyId,
        name: "Empresa Atualizada",
        manager_id: "123.456.789-00",
        location: "Rua B, 456",
      })
    );
  });

  it("deve retornar status 404 ao tentar editar uma empresa inexistente", async () => {
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

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const updatedCompany = {
      name: "Empresa Atualizada",
      manager_id: "123.456.789-00",
      location: "Rua B, 456",
    };

    const response_update = await request(app)
      .put("/company/999")
      .send(updatedCompany)
      .set("Authorization", `Bearer ${token}`);

    expect(response_update.status).toBe(404);
    expect(response_update.body).toEqual({
      message: "Empresa com id 999 não encontrada.",
    });
  });

  it("deve retornar status 400 ao tentar editar uma empresa sem nome", async () => {
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

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const newCompany = {
      name: "Empresa Teste",
      manager_id: "123.456.789-00",
      location: "Rua A, 123",
    };

    const response_create = await request(app)
      .post("/company")
      .send(newCompany)
      .set("Authorization", `Bearer ${token}`);

    expect(response_create.status).toBe(201);

    const companyId = response_create.body.id;

    const invalidCompany = {
      manager_id: "123.456.789-00",
      location: "Rua B, 456",
    };

    const response_update = await request(app)
      .put(`/company/${companyId}`)
      .send(invalidCompany)
      .set("Authorization", `Bearer ${token}`);

    expect(response_update.status).toBe(400);
    expect(response_update.body).toEqual({
      message: "O campo nome é obrigatório.",
    });
  });

  it("deve retornar status 400 ao tentar editar uma empresa sem localização", async () => {
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

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const newCompany = {
      name: "Empresa Teste",
      manager_id: "123.456.789-00",
      location: "Rua A, 123",
    };

    const response_create = await request(app)
      .post("/company")
      .send(newCompany)
      .set("Authorization", `Bearer ${token}`);

    expect(response_create.status).toBe(201);

    const companyId = response_create.body.id;

    const invalidCompany = {
      name: "Empresa Atualizada",
      manager_id: "123.456.789-00",
    };

    const response_update = await request(app)
      .put(`/company/${companyId}`)
      .send(invalidCompany)
      .set("Authorization", `Bearer ${token}`);

    expect(response_update.status).toBe(400);
    expect(response_update.body).toEqual({
      message: "O campo localização é obrigatório.",
    });
  });

  describe("CompanyController - deleteOneCompany", () => {
    it("deve retornar status 204 ao deletar uma empresa existente", async () => {
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
  
      const response_login = await request(app).post("/auth/login").send(login);
      const token = response_login.body.token;
  
      const newCompany = {
        name: "Empresa Teste",
        manager_id: "123.456.789-00",
        location: "Rua A, 123",
      };
  
      const response_create = await request(app)
        .post("/company")
        .send(newCompany)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_create.status).toBe(201);
  
      const companyId = response_create.body.id;
  
      const response_delete = await request(app)
        .delete(`/company/${companyId}`)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_delete.status).toBe(204);
    });
  
    it("deve retornar status 404 ao tentar deletar uma empresa inexistente", async () => {
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
  
      const response_login = await request(app).post("/auth/login").send(login);
      const token = response_login.body.token;
  
      const response_delete = await request(app)
        .delete("/company/999")
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_delete.status).toBe(404);
      expect(response_delete.body).toEqual({
        message: "Empresa com id 999 não encontrada.",
      });
    });
  
    it("deve retornar status 400 ao tentar deletar uma empresa com id inválido", async () => {
      const boss = {
        id: "123.456.789-00",
        name: "Carlos",
        password: "123",
        type: "ultra",
      };
  
      await request(app).post("/users").send(boss);
  
      const login = {
        cpf: "123.456.789-00",
        password: "123",
      };
  
      const response_login = await request(app).post("/auth/login").send(login);
      const token = response_login.body.token;
  
      const response_delete = await request(app)
        .delete("/company/abc")
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_delete.status).toBe(400);
      expect(response_delete.body).toEqual({
        error: "O id da empresa deve ser um número",
      });
    });
  });
});

