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

describe("BuildingController - createBuilding", () => {
    it("deve retornar status 201 e criar um novo prédio", async () => {
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
  
      const response_create_company = await request(app)
        .post("/company")
        .send(newCompany)
        .set("Authorization", `Bearer ${token}`);
  
      const companyId = response_create_company.body.id;
  
      const newBuilding = {
        name: "Prédio Teste",
        company_id: companyId,
      };
  
      const response_create_building = await request(app)
        .post("/building")
        .send(newBuilding)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_create_building.status).toBe(201);
      expect(response_create_building.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: "Prédio Teste",
          company_id: companyId,
        })
      );
    });
  
    it("deve retornar status 400 ao tentar criar um prédio sem nome", async () => {
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
  
      const response_create_company = await request(app)
        .post("/company")
        .send(newCompany)
        .set("Authorization", `Bearer ${token}`);
  

      const companyId = response_create_company.body.id;
  
      const invalidBuilding = {
        company_id: companyId,
      };
  
      const response_create_building = await request(app)
        .post("/building")
        .send(invalidBuilding)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_create_building.status).toBe(400);
      expect(response_create_building.body).toEqual({
        message: "O campo nome é obrigatório.",
      });
    });
  
    it("deve retornar status 400 ao tentar criar um prédio sem id da empresa", async () => {
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
  
      const newBuilding = {
        name: "Prédio Teste",
      };
  
      const response_create_building = await request(app)
        .post("/building")
        .send(newBuilding)
        .set("Authorization", `Bearer ${token}`);
      console.log(response_create_building.text);
      expect(response_create_building.status).toBe(400);
      expect(response_create_building.body).toEqual({
        message: "O campo id da empresa é obrigatório.",
      });
    });
  
    it("deve retornar status 409 ao tentar criar um prédio com nome já existente na mesma empresa", async () => {
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
  
      const response_create_company = await request(app)
        .post("/company")
        .send(newCompany)
        .set("Authorization", `Bearer ${token}`);
  

      const companyId = response_create_company.body.id;
  
      const newBuilding = {
        name: "Prédio Teste",
        company_id: companyId,
      };
  
      const response_create_building = await request(app)
        .post("/building")
        .send(newBuilding)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_create_building.status).toBe(201);
  
      const response_duplicate_building = await request(app)
        .post("/building")
        .send(newBuilding)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_duplicate_building.status).toBe(409);
      expect(response_duplicate_building.body).toEqual({
        message: "Um prédio com este nome já existe.",
      });
    });
});

describe("BuildingController - getOneBuilding", () => {
    it("deve retornar status 200 e os dados do prédio quando ele existir", async () => {
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
  
      const response_create_company = await request(app)
        .post("/company")
        .send(newCompany)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_create_company.status).toBe(201);
  
      const companyId = response_create_company.body.id;
  
      const newBuilding = {
        name: "Prédio Teste",
        company_id: companyId,
      };
  
      const response_create_building = await request(app)
        .post("/building")
        .send(newBuilding)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_create_building.status).toBe(201);
  
      const buildingId = response_create_building.body.id;
  
      const response_get_building = await request(app)
        .get(`/building/${buildingId}`)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_get_building.status).toBe(200);
      expect(response_get_building.body).toEqual(
        expect.objectContaining({
          id: buildingId,
          name: "Prédio Teste",
          company_id: companyId,
        })
      );
    });
  
    it("deve retornar status 404 quando o prédio não existir", async () => {
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
  
      const response_get_building = await request(app)
        .get("/building/999")
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_get_building.status).toBe(404);
      expect(response_get_building.body).toEqual({
        message: "Prédio com id 999 não encontrado.",
      });
    });
  
    it("deve retornar status 400 quando o id do prédio for inválido", async () => {
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
  
      const response_get_building = await request(app)
        .get("/building/abc")
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_get_building.status).toBe(400);
      expect(response_get_building.body).toEqual({
        error: "O id do prédio deve ser um número.",
      });
    });
});

describe("BuildingController - getBuildingByCompany", () => {
  it("deve retornar status 200 e uma lista de prédios quando houver prédios registrados para a empresa", async () => {
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

    const response_create_company = await request(app)
      .post("/company")
      .send(newCompany)
      .set("Authorization", `Bearer ${token}`);

    expect(response_create_company.status).toBe(201);

    const companyId = response_create_company.body.id;

    const building1 = {
      name: "Prédio 1",
      company_id: companyId,
    };

    const building2 = {
      name: "Prédio 2",
      company_id: companyId,
    };

    await request(app)
      .post("/building")
      .send(building1)
      .set("Authorization", `Bearer ${token}`);

    await request(app)
      .post("/building")
      .send(building2)
      .set("Authorization", `Bearer ${token}`);

    const response_get_buildings = await request(app)
      .get(`/building/company/${companyId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response_get_buildings.status).toBe(200);
    expect(response_get_buildings.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Prédio 1", company_id: companyId }),
        expect.objectContaining({ name: "Prédio 2", company_id: companyId }),
      ])
    );
  });

  it("deve retornar status 204 quando não houver prédios registrados para a empresa", async () => {
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

    const response_create_company = await request(app)
      .post("/company")
      .send(newCompany)
      .set("Authorization", `Bearer ${token}`);
    
    const companyId = response_create_company.body.id;

    const response_get_buildings = await request(app)
      .get(`/building/company/${companyId}`)
      .set("Authorization", `Bearer ${token}`);
    console.log(response_get_buildings.text);
    expect(response_get_buildings.status).toBe(200);
    expect(response_get_buildings.body).toEqual({
      message: `Não há prédios registrados para a empresa com id ${companyId}`,
    });
  });

  it("deve retornar status 400 quando o id da empresa for inválido", async () => {
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

    const response_get_buildings = await request(app)
      .get("/building/company/abc")
      .set("Authorization", `Bearer ${token}`);

    expect(response_get_buildings.status).toBe(400);
    expect(response_get_buildings.body).toEqual({
      error: "O id da empresa deve ser um número.",
    });
  });   
});

describe("BuildingController - editOneBuilding", () => {
  it("deve retornar status 201 e atualizar os dados do prédio com sucesso", async () => {
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

    const response_create_company = await request(app)
      .post("/company")
      .send(newCompany)
      .set("Authorization", `Bearer ${token}`);

    const companyId = response_create_company.body.id;

    const newBuilding = {
      name: "Prédio Teste",
      company_id: companyId,
    };

    const response_create_building = await request(app)
      .post("/building")
      .send(newBuilding)
      .set("Authorization", `Bearer ${token}`);

    const buildingId = response_create_building.body.id;

    const updatedBuilding = {
      name: "Prédio Atualizado",
      company_id: companyId,
    };

    const response_update_building = await request(app)
      .put(`/building/${buildingId}`)
      .send(updatedBuilding)
      .set("Authorization", `Bearer ${token}`);

    expect(response_update_building.status).toBe(201);
    expect(response_update_building.body).toEqual(
      expect.objectContaining({
        id: buildingId,
        name: "Prédio Atualizado",
        company_id: companyId,
      })
    );
  });

  it("deve retornar status 404 ao tentar editar um prédio inexistente", async () => {
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

    const updatedBuilding = {
      name: "Prédio Atualizado",
      company_id: 1,
    };

    const response_update_building = await request(app)
      .put("/building/999")
      .send(updatedBuilding)
      .set("Authorization", `Bearer ${token}`);

    expect(response_update_building.status).toBe(404);
    expect(response_update_building.body).toEqual({
      message: "Prédio com id 999 não encontrado.",
    });
  });

  it("deve retornar status 400 ao tentar editar um prédio sem nome", async () => {
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

    const response_create_company = await request(app)
      .post("/company")
      .send(newCompany)
      .set("Authorization", `Bearer ${token}`);

    const companyId = response_create_company.body.id;

    const newBuilding = {
      name: "Prédio Teste",
      company_id: companyId,
    };

    const response_create_building = await request(app)
      .post("/building")
      .send(newBuilding)
      .set("Authorization", `Bearer ${token}`);

    const buildingId = response_create_building.body.id;

    const invalidBuilding = {
      company_id: companyId,
    };

    const response_update_building = await request(app)
      .put(`/building/${buildingId}`)
      .send(invalidBuilding)
      .set("Authorization", `Bearer ${token}`);

    expect(response_update_building.status).toBe(400);
    expect(response_update_building.body).toEqual({
      message: "O campo nome é obrigatório.",
    });
  });
});  

describe("BuildingController - deleteOneBuilding", () => {
  it("deve retornar status 200 ao deletar um prédio existente", async () => {
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

    const response_create_company = await request(app)
      .post("/company")
      .send(newCompany)
      .set("Authorization", `Bearer ${token}`);

    const companyId = response_create_company.body.id;

    const newBuilding = {
      name: "Prédio Teste",
      company_id: companyId,
    };

    const response_create_building = await request(app)
      .post("/building")
      .send(newBuilding)
      .set("Authorization", `Bearer ${token}`);

    const buildingId = response_create_building.body.id;

    const response_delete_building = await request(app)
      .delete(`/building/${buildingId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response_delete_building.status).toBe(200);
    expect(response_delete_building.body).toEqual({
      message: `Prédio com id ${buildingId} excluído com sucesso.`,
    });
  });

  it("deve retornar status 404 ao tentar deletar um prédio inexistente", async () => {
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

    const response_delete_building = await request(app)
      .delete("/building/999")
      .set("Authorization", `Bearer ${token}`);

    expect(response_delete_building.status).toBe(404);
    expect(response_delete_building.body).toEqual({
      message: "Prédio com id 999 não encontrado.",
    });
  });

  it("deve retornar status 400 ao tentar deletar um prédio com ID inválido", async () => {
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

    const response_delete_building = await request(app)
      .delete("/building/abc")
      .set("Authorization", `Bearer ${token}`);

    expect(response_delete_building.status).toBe(400);
    expect(response_delete_building.body).toEqual({
      error: "O id do prédio deve ser um número.",
    });
  });
});