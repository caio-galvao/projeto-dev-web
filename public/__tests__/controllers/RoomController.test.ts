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

describe("RoomController - createRoom", () => {
    it("deve retornar status 201 e criar uma nova sala", async () => {
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
  
    const newRoom = {
      building_id: buildingId,
      manager_id: "123.456.789-00",
      name: "Sala Teste",
      schedule: "08:00-18:00",
      workspace_config: "Configuração padrão",
      equipments: ["Projetor", "Mesa", "Cadeiras"],
    };
  
      const response_create_room = await request(app)
        .post("/room")
        .send(newRoom)
        .set("Authorization", `Bearer ${token}`);
          
      expect(response_create_room.status).toBe(201);
      expect(response_create_room.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          building_id: buildingId,
          manager_id: "123.456.789-00",
          name: "Sala Teste",
          schedule: "08:00-18:00",
          workspace_config: "Configuração padrão",
          equipments: ["Projetor", "Mesa", "Cadeiras"],
        })
      );
    });
  
    it("deve retornar status 400 ao tentar criar uma sala sem nome", async () => {
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
  
      const invalidRoom = {
        building_id: buildingId,
        manager_id: "123.456.789-00",
        schedule: "08:00-18:00",
        workspace_config: "Configuração padrão",
        equipments: ["Projetor", "Mesa", "Cadeiras"],
      };
  
      const response_create_room = await request(app)
        .post("/room")
        .send(invalidRoom)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_create_room.status).toBe(400);
      expect(response_create_room.body).toEqual({
        message: "O campo nome é obrigatório.",
      });
    });
  
    it("deve retornar status 400 ao tentar criar uma sala sem id do prédio", async () => {
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
  
      const invalidRoom = {
        manager_id: "123.456.789-00",
        name: "Sala Teste",
        schedule: "08:00-18:00",
        workspace_config: "Configuração padrão",
        equipments: ["Projetor", "Mesa", "Cadeiras"],
      };
  
      const response_create_room = await request(app)
        .post("/room")
        .send(invalidRoom)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_create_room.status).toBe(400);
      expect(response_create_room.body).toEqual({
        message: "O campo id do prédio é obrigatório.",
      });
    });
  
    it("deve retornar status 409 ao tentar criar uma sala com nome já existente no mesmo prédio", async () => {
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
  
      const newRoom = {
        building_id: buildingId,
        manager_id: "123.456.789-00",
        name: "Sala Teste",
        schedule: "08:00-18:00",
        workspace_config: "Configuração padrão",
        equipments: ["Projetor", "Mesa", "Cadeiras"],
      };
  
      await request(app)
        .post("/room")
        .send(newRoom)
        .set("Authorization", `Bearer ${token}`);
  
      const response_duplicate_room = await request(app)
        .post("/room")
        .send(newRoom)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response_duplicate_room.status).toBe(409);
      expect(response_duplicate_room.body).toEqual({
        message: "Uma sala com este nome já existe.",
      });
    });

    it("deve retornar status 400 ao tentar criar uma sala sem id do gerente", async () => {
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
    
        const invalidRoom = {
          building_id: buildingId,
          name: "Sala Teste",
          schedule: "08:00-18:00",
          workspace_config: "Configuração padrão",
          equipments: ["Projetor", "Mesa", "Cadeiras"],
        };
    
        const response_create_room = await request(app)
          .post("/room")
          .send(invalidRoom)
          .set("Authorization", `Bearer ${token}`);
    
        expect(response_create_room.status).toBe(400);
        expect(response_create_room.body).toEqual({
          message: "O campo id do gerente é obrigatório.",
        });
    });
    
      it("deve retornar status 400 ao tentar criar uma sala com id do gerente no formato errado", async () => {
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
    
        const invalidRoom = {
          building_id: buildingId,
          manager_id: "12345678900",
          name: "Sala Teste",
          schedule: "08:00-18:00",
          workspace_config: "Configuração padrão",
          equipments: ["Projetor", "Mesa", "Cadeiras"],
        };
    
        const response_create_room = await request(app)
          .post("/room")
          .send(invalidRoom)
          .set("Authorization", `Bearer ${token}`);
    
        expect(response_create_room.status).toBe(400);
        expect(response_create_room.body).toEqual({
          message: "O campo id do gerente deve estar no formato XXX.XXX.XXX-XX.",
        });
    });
    
      it("deve retornar status 400 ao tentar criar uma sala com id do prédio não sendo um número", async () => {
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
    
        const invalidRoom = {
          building_id: "abc",
          manager_id: "123.456.789-00",
          name: "Sala Teste",
          schedule: "08:00-18:00",
          workspace_config: "Configuração padrão",
          equipments: ["Projetor", "Mesa", "Cadeiras"],
        };
    
        const response_create_room = await request(app)
          .post("/room")
          .send(invalidRoom)
          .set("Authorization", `Bearer ${token}`);
    
        expect(response_create_room.status).toBe(400);
        expect(response_create_room.body).toEqual({
          error: "O id do prédio deve ser um número",
        });
    });
    
      it("deve retornar status 400 ao tentar criar uma sala sem horário", async () => {
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
    
        const invalidRoom = {
          building_id: buildingId,
          manager_id: "123.456.789-00",
          name: "Sala Teste",
          workspace_config: "Configuração padrão",
          equipments: ["Projetor", "Mesa", "Cadeiras"],
        };
    
        const response_create_room = await request(app)
          .post("/room")
          .send(invalidRoom)
          .set("Authorization", `Bearer ${token}`);
    
        expect(response_create_room.status).toBe(400);
        expect(response_create_room.body).toEqual({
          message: "O campo horários é obrigatório.",
        });
    });

      it("deve retornar status 400 ao tentar criar uma sala sem configuração de espaço", async () => {
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
    
        const invalidRoom = {
          building_id: buildingId,
          manager_id: "123.456.789-00",
          name: "Sala Teste",
          schedule: "08:00-18:00",
          equipments: ["Projetor", "Mesa", "Cadeiras"],
        };
    
        const response_create_room = await request(app)
          .post("/room")
          .send(invalidRoom)
          .set("Authorization", `Bearer ${token}`);
    
        expect(response_create_room.status).toBe(400);
        expect(response_create_room.body).toEqual({
          message: "O campo configuração de espaço é obrigatório.",
        });
    });
    
      it("deve retornar status 400 ao tentar criar uma sala sem equipamentos", async () => {
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
    
        const invalidRoom = {
          building_id: buildingId,
          manager_id: "123.456.789-00",
          name: "Sala Teste",
          schedule: "08:00-18:00",
          workspace_config: "Configuração padrão",
        };
    
        const response_create_room = await request(app)
          .post("/room")
          .send(invalidRoom)
          .set("Authorization", `Bearer ${token}`);
    
        expect(response_create_room.status).toBe(400);
        expect(response_create_room.body).toEqual({
          message: "O campo equipamentos é obrigatório.",
        });
    });
    
    //   it("deve retornar status 404 ao tentar criar uma sala com prédio não encontrado", async () => {
    //     const boss = {
    //       id: "123.456.789-00",
    //       name: "Carlos",
    //       password: "123",
    //       type: "ulta",
    //     };
    
    //     await request(app).post("/users").send(boss);
    
    //     const login = {
    //       cpf: "123.456.789-00",
    //       password: "123",
    //     };
    
    //     const response_login = await request(app).post("/auth/login").send(login);
    //     const token = response_login.body.token;
    
    //     const invalidRoom = {
    //       building_id: 999,
    //       manager_id: "123.456.789-00",
    //       name: "Sala Teste",
    //       schedule: "08:00-18:00",
    //       workspace_config: "Configuração padrão",
    //       equipments: ["Projetor", "Mesa", "Cadeiras"],
    //     };
    
    //     const response_create_room = await request(app)
    //       .post("/room")
    //       .send(invalidRoom)
    //       .set("Authorization", `Bearer ${token}`);
    //     console.log(response_create_room.text);
    //     expect(response_create_room.status).toBe(404);
    //     expect(response_create_room.body).toEqual({
    //       message: "Id do prédio não encontrado",
    //     });
    //   });
    
      it("deve retornar status 404 ao tentar criar uma sala com gerente não encontrado", async () => {
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
    
        const invalidRoom = {
          building_id: buildingId,
          manager_id: "999.999.999-99",
          name: "Sala Teste",
          schedule: "08:00-18:00",
          workspace_config: "Configuração padrão",
          equipments: ["Projetor", "Mesa", "Cadeiras"],
        };
    
        const response_create_room = await request(app)
          .post("/room")
          .send(invalidRoom)
          .set("Authorization", `Bearer ${token}`);
    
        expect(response_create_room.status).toBe(404);
        expect(response_create_room.body).toEqual({
          message: "Id do gerente não encontrado",
        });
    });

  });

describe("RoomController - getRoomsByBuilding", () => {
    it("deve retornar status 200 e uma lista de salas quando houver salas registradas no prédio", async () => {
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

        const room1 = {
        building_id: buildingId,
        manager_id: "123.456.789-00",
        name: "Sala 1",
        schedule: "08:00-18:00",
        workspace_config: "Configuração padrão",
        equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const room2 = {
        building_id: buildingId,
        manager_id: "123.456.789-00",
        name: "Sala 2",
        schedule: "08:00-18:00",
        workspace_config: "Configuração padrão",
        equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        await request(app)
        .post("/room")
        .send(room1)
        .set("Authorization", `Bearer ${token}`);

        await request(app)
        .post("/room")
        .send(room2)
        .set("Authorization", `Bearer ${token}`);

        const response_get_rooms = await request(app)
        .get(`/room/building/${buildingId}`)
        .set("Authorization", `Bearer ${token}`);

        expect(response_get_rooms.status).toBe(200);
        expect(response_get_rooms.body).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ name: "Sala 1" }),
            expect.objectContaining({ name: "Sala 2" }),
        ])
        );
    });

    it("deve retornar status 200 e uma mensagem quando não houver salas registradas no prédio", async () => {
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

        const response_get_rooms = await request(app)
        .get(`/room/building/${buildingId}`)
        .set("Authorization", `Bearer ${token}`);

        expect(response_get_rooms.status).toBe(200);
        expect(response_get_rooms.body).toEqual({
        message: "Não há salas resgistradas",
        });
    });

    // it("deve retornar status 400 quando o id do prédio não for passado", async () => {
    //     const boss = {
    //         id: "123.456.789-00",
    //         name: "Carlos",
    //         password: "123",
    //         type: "master",
    //     };

    //     await request(app).post("/users").send(boss);

    //     const login = {
    //         cpf: "123.456.789-00",
    //         password: "123",
    //     };

    //     const response_login = await request(app).post("/auth/login").send(login);
    //     const token = response_login.body.token;

    //     const response_get_rooms = await request(app)
    //         .get("/room/building/")
    //         .set("Authorization", `Bearer ${token}`);

    //     expect(response_get_rooms.status).toBe(400);
    //     expect(response_get_rooms.body).toEqual({
    //         message: "O campo id do prédio é obrigatório.",
    //     });
    // });

    it("deve retornar status 404 quando o prédio não for encontrado", async () => {
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

        const response_get_rooms = await request(app)
        .get("/room/building/999")
        .set("Authorization", `Bearer ${token}`);

        expect(response_get_rooms.status).toBe(404);
        expect(response_get_rooms.body).toEqual({
        message: "Prédio não encontrado",
        });
    });

    it("deve retornar status 400 quando o id do prédio não for um número", async () => {
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

        const response_get_rooms = await request(app)
        .get("/room/building/abc")
        .set("Authorization", `Bearer ${token}`);

        expect(response_get_rooms.status).toBe(400);
        expect(response_get_rooms.body).toEqual({
        error: "O id do prédio deve ser um número.",
        });
    });
});

describe("RoomController - getRoomsByManager", () => {
    it("deve retornar status 200 e uma lista de salas quando houver salas registradas para o gerente", async () => {
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

        const room1 = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala 1",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const room2 = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala 2",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        await request(app)
            .post("/room")
            .send(room1)
            .set("Authorization", `Bearer ${token}`);

        await request(app)
            .post("/room")
            .send(room2)
            .set("Authorization", `Bearer ${token}`);

        const response_get_rooms = await request(app)
            .get(`/room/manager/123.456.789-00`)
            .set("Authorization", `Bearer ${token}`);

        expect(response_get_rooms.status).toBe(200);
        expect(response_get_rooms.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "Sala 1" }),
                expect.objectContaining({ name: "Sala 2" }),
            ])
        );
    });

    it("deve retornar status 200 e uma mensagem quando não houver salas registradas para o gerente", async () => {
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

        const response_get_rooms = await request(app)
            .get(`/room/manager/123.456.789-00`)
            .set("Authorization", `Bearer ${token}`);

        expect(response_get_rooms.status).toBe(200);
        expect(response_get_rooms.body).toEqual({
            message: "Não há salas resgistradas para este gerente",
        });
    });

    it("deve retornar status 404 quando o gerente não for encontrado", async () => {
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

        const response_get_rooms = await request(app)
            .get(`/room/manager/999.999.999-99`)
            .set("Authorization", `Bearer ${token}`);

        expect(response_get_rooms.status).toBe(404);
        expect(response_get_rooms.body).toEqual({
            message: "Gerente não encontrado",
        });
    });
});

describe("RoomController - getOneRoom", () => {
    it("deve retornar status 200 e os detalhes da sala quando a sala existir", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const response_get_room = await request(app)
            .get(`/room/${roomId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response_get_room.status).toBe(200);
        expect(response_get_room.body).toEqual(
            expect.objectContaining({
                id: roomId,
                name: "Sala Teste",
                building_id: buildingId,
                manager_id: "123.456.789-00",
            })
        );
    });

    it("deve retornar status 404 quando a sala não estiver cadastrada", async () => {
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

        const response_get_room = await request(app)
            .get("/room/999")
            .set("Authorization", `Bearer ${token}`);

        expect(response_get_room.status).toBe(404);
        expect(response_get_room.body).toEqual({
            message: "Sala com id 999 não encontrada",
        });
    });
});

describe("RoomController - editOneRoom", () => {
    it("deve editar uma sala com sucesso", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const updatedRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Atualizada",
            schedule: "09:00-17:00",
            workspace_config: "Configuração avançada",
            equipments: ["Projetor", "Cadeiras"],
        };

        const response_edit_room = await request(app)
            .put(`/room/${roomId}`)
            .send(updatedRoom)
            .set("Authorization", `Bearer ${token}`);

        expect(response_edit_room.status).toBe(201);
        expect(response_edit_room.body).toEqual(
            expect.objectContaining({
                id: roomId,
                name: "Sala Atualizada",
                schedule: "09:00-17:00",
                workspace_config: "Configuração avançada",
                equipments: ["Projetor", "Cadeiras"],
            })
        );
    });

    it("deve retornar status 409 ao tentar editar uma sala com nome já cadastrado", async () => {
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

        const room1 = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala 1",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const room2 = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala 2",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room1 = await request(app)
            .post("/room")
            .send(room1)
            .set("Authorization", `Bearer ${token}`);

        const response_create_room2 = await request(app)
            .post("/room")
            .send(room2)
            .set("Authorization", `Bearer ${token}`);

        const room2Id = response_create_room2.body.id;

        const updatedRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala 1",
            schedule: "09:00-17:00",
            workspace_config: "Configuração avançada",
            equipments: ["Projetor", "Cadeiras"],
        };

        const response_edit_room = await request(app)
            .put(`/room/${room2Id}`)
            .send(updatedRoom)
            .set("Authorization", `Bearer ${token}`);
        console.log(response_edit_room.text);
        expect(response_edit_room.status).toBe(409);
        expect(response_edit_room.body).toEqual({
            message: "Uma sala com este nome já existe.",
        });
    });

    it("deve retornar status 400 ao tentar editar uma sala sem ID de prédio", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const invalidRoom = {
            manager_id: "123.456.789-00",
            name: "Sala Atualizada",
            schedule: "09:00-17:00",
            workspace_config: "Configuração avançada",
            equipments: ["Projetor", "Cadeiras"],
        };

        const response_edit_room = await request(app)
            .put(`/room/${roomId}`)
            .send(invalidRoom)
            .set("Authorization", `Bearer ${token}`);

        expect(response_edit_room.status).toBe(400);
        expect(response_edit_room.body).toEqual({
            message: "O campo id do prédio é obrigatório.",
        });
    });

    it("deve retornar status 400 ao tentar editar uma sala sem ID de gerente", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const invalidRoom = {
            building_id: buildingId,
            name: "Sala Atualizada",
            schedule: "09:00-17:00",
            workspace_config: "Configuração avançada",
            equipments: ["Projetor", "Cadeiras"],
        };

        const response_edit_room = await request(app)
            .put(`/room/${roomId}`)
            .send(invalidRoom)
            .set("Authorization", `Bearer ${token}`);

        expect(response_edit_room.status).toBe(400);
        expect(response_edit_room.body).toEqual({
            message: "O campo id do gerente é obrigatório.",
        });
    });

    it("deve retornar status 400 ao tentar editar uma sala sem horários", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const invalidRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Atualizada",
            workspace_config: "Configuração avançada",
            equipments: ["Projetor", "Cadeiras"],
        };

        const response_edit_room = await request(app)
            .put(`/room/${roomId}`)
            .send(invalidRoom)
            .set("Authorization", `Bearer ${token}`);

        expect(response_edit_room.status).toBe(400);
        expect(response_edit_room.body).toEqual({
            message: "O campo horários é obrigatório.",
        });
    });

    it("deve retornar status 400 ao tentar editar uma sala sem configuração dos espaços de trabalho", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const invalidRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Atualizada",
            schedule: "09:00-17:00",
            equipments: ["Projetor", "Cadeiras"],
        };

        const response_edit_room = await request(app)
            .put(`/room/${roomId}`)
            .send(invalidRoom)
            .set("Authorization", `Bearer ${token}`);

        expect(response_edit_room.status).toBe(400);
        expect(response_edit_room.body).toEqual({
            message: "O campo configuração de espaço é obrigatório.",
        });
    });

    it("deve retornar status 400 ao tentar editar uma sala sem equipamentos", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const invalidRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Atualizada",
            schedule: "09:00-17:00",
            workspace_config: "Configuração avançada",
        };

        const response_edit_room = await request(app)
            .put(`/room/${roomId}`)
            .send(invalidRoom)
            .set("Authorization", `Bearer ${token}`);

        expect(response_edit_room.status).toBe(400);
        expect(response_edit_room.body).toEqual({
            message: "O campo equipamentos é obrigatório.",
        });
    });

    it("deve retornar status 404 ao tentar editar uma sala com ID de prédio não cadastrado", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const invalidRoom = {
            building_id: 999,
            manager_id: "123.456.789-00",
            name: "Sala Atualizada",
            schedule: "09:00-17:00",
            workspace_config: "Configuração avançada",
            equipments: ["Projetor", "Cadeiras"],
        };

        const response_edit_room = await request(app)
            .put(`/room/${roomId}`)
            .send(invalidRoom)
            .set("Authorization", `Bearer ${token}`);

        expect(response_edit_room.status).toBe(404);
        expect(response_edit_room.body).toEqual({
            message: "Id do prédio não encontrado",
        });
    });

    it("deve retornar status 404 ao tentar editar uma sala com ID de gerente não cadastrado", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const invalidRoom = {
            building_id: buildingId,
            manager_id: "999.999.999-99",
            name: "Sala Atualizada",
            schedule: "09:00-17:00",
            workspace_config: "Configuração avançada",
            equipments: ["Projetor", "Cadeiras"],
        };

        const response_edit_room = await request(app)
            .put(`/room/${roomId}`)
            .send(invalidRoom)
            .set("Authorization", `Bearer ${token}`);

        expect(response_edit_room.status).toBe(404);
        expect(response_edit_room.body).toEqual({
            message: "Id do gerente não encontrado",
        });
    });
});

describe("RoomController - deleteOneRoom", () => {
    it("deve deletar uma sala existente com sucesso", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const response_delete_room = await request(app)
            .delete(`/room/${roomId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response_delete_room.status).toBe(200);
        expect(response_delete_room.body).toEqual({
            message: `Sala com id ${roomId} excluída com sucesso.`,
        });
    });

    it("deve retornar status 404 ao tentar deletar uma sala não cadastrada", async () => {
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

        const response_delete_room = await request(app)
            .delete("/room/999")
            .set("Authorization", `Bearer ${token}`);

        expect(response_delete_room.status).toBe(404);
        expect(response_delete_room.body).toEqual({
            message: "Sala com id 999 não encontrada.",
        });
    });
});

describe("RoomController - getUsersByRoom", () => {
    it("deve retornar status 200 e uma lista de usuários quando houver usuários registrados na sala", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const user = {
            id: "987.654.321-00",
            name: "João",
            password: "123",
            type: "admin",
        };

        await request(app).post("/users").send(user);

        await request(app)
            .post(`/room/${roomId}/user/${user.id}`)
            .set("Authorization", `Bearer ${token}`);

        const response_get_users = await request(app)
            .get(`/room/user/${roomId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response_get_users.status).toBe(200);
        expect(response_get_users.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: "987.654.321-00", name: "João" }),
            ])
        );
    });

    it("deve retornar status 200 e uma mensagem quando não houver usuários registrados na sala", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const response_get_users = await request(app)
            .get(`/room/user/${roomId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response_get_users.status).toBe(200);
        expect(response_get_users.body).toEqual({
            message: "Não há usuários registrados nesta sala",
        });
    });

    it("deve retornar status 404 quando a sala não for encontrada", async () => {
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

        const response_get_users = await request(app)
            .get("/room/user/999")
            .set("Authorization", `Bearer ${token}`);

        expect(response_get_users.status).toBe(404);
        expect(response_get_users.body).toEqual({
            message: "Id da sala não encontrado",
        });
    });
});

describe("RoomController - addUserInRoom", () => {
    it("deve adicionar um usuário a uma sala com sucesso", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const user = {
            id: "987.654.321-00",
            name: "João",
            password: "123",
            type: "admin",
        };

        await request(app).post("/users").send(user);

        const response_add_user = await request(app)
            .post(`/room/${roomId}/user/${user.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response_add_user.status).toBe(201);
        expect(response_add_user.body).toEqual(
            expect.objectContaining({
                room_id: roomId,
                user_id: "987.654.321-00",
            })
        );
    });

    it("deve retornar status 409 ao tentar adicionar um usuário já registrado na sala", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const user = {
            id: "987.654.321-00",
            name: "João",
            password: "123",
            type: "admin",
        };

        await request(app).post("/users").send(user);

        await request(app)
            .post(`/room/${roomId}/user/${user.id}`)
            .set("Authorization", `Bearer ${token}`);

        const response_add_user_again = await request(app)
            .post(`/room/${roomId}/user/${user.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response_add_user_again.status).toBe(409);
        expect(response_add_user_again.body).toEqual({
            message: "O usuário já está cadastrado na sala.",
        });
    });

    it("deve retornar status 404 ao tentar adicionar um usuário a uma sala inexistente", async () => {
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

        const user = {
            id: "987.654.321-00",
            name: "João",
            password: "123",
            type: "admin",
        };

        await request(app).post("/users").send(user);

        const response_add_user = await request(app)
            .post(`/room/999/user/${user.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response_add_user.status).toBe(404);
        expect(response_add_user.body).toEqual({
            message: `Sala com id 999 não encontrada.`,
        });
    });

    it("deve retornar status 404 ao tentar adicionar um usuário inexistente a uma sala", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const response_add_user = await request(app)
            .post(`/room/${roomId}/user/999.999.999-99`)
            .set("Authorization", `Bearer ${token}`);

        expect(response_add_user.status).toBe(404);
        expect(response_add_user.body).toEqual({
            message: "Usuário com id 999.999.999-99 não encontrado.",
        });
    });
});

describe("RoomController - deleteUserFromRoom", () => {
    it("deve remover um usuário de uma sala com sucesso", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const user = {
            id: "987.654.321-00",
            name: "João",
            password: "123",
            type: "admin",
        };

        await request(app).post("/users").send(user);

        await request(app)
            .post(`/room/${roomId}/user/${user.id}`)
            .set("Authorization", `Bearer ${token}`);

        const response_delete_user = await request(app)
            .delete(`/room/${roomId}/user/${user.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response_delete_user.status).toBe(200);
        expect(response_delete_user.body).toEqual({
            message: `Usuário com id ${user.id} excluído da sala com sucesso.`,
        });
    });

    it("deve retornar status 404 ao tentar remover um usuário de uma sala inexistente", async () => {
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

        const user = {
            id: "987.654.321-00",
            name: "João",
            password: "123",
            type: "admin",
        };

        await request(app).post("/users").send(user);

        const response_delete_user = await request(app)
            .delete(`/room/999/user/${user.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response_delete_user.status).toBe(404);
        expect(response_delete_user.body).toEqual({
            message: "Sala com id 999 não encontrada.",
        });
    });

    it("deve retornar status 404 ao tentar remover um usuário inexistente de uma sala", async () => {
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

        const newRoom = {
            building_id: buildingId,
            manager_id: "123.456.789-00",
            name: "Sala Teste",
            schedule: "08:00-18:00",
            workspace_config: "Configuração padrão",
            equipments: ["Projetor", "Mesa", "Cadeiras"],
        };

        const response_create_room = await request(app)
            .post("/room")
            .send(newRoom)
            .set("Authorization", `Bearer ${token}`);

        const roomId = response_create_room.body.id;

        const response_delete_user = await request(app)
            .delete(`/room/${roomId}/user/999.999.999-99`)
            .set("Authorization", `Bearer ${token}`);

        expect(response_delete_user.status).toBe(404);
        expect(response_delete_user.body).toEqual({
            message: "Usuário ou sala não encontrados.",
        });
    });
});
