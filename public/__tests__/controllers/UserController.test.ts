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

describe("UserController - getAllUsers", () => {
  it("deve retornar status 200 e uma lista de usuários quando houver usuários cadastrados", async () => {
    const user1 = {
      id: "123.456.789-00",
      name: "João",
      password: "123",
      type: "comum",
    };

    const user2 = {
      id: "987.654.321-00",
      name: "Maria",
      password: "123",
      type: "ultra",
    };

    await request(app).post("/users").send(user1);
    await request(app).post("/users").send(user2);

    const login = {
      cpf: "987.654.321-00", // Apenas o usuário "ultra" pode autenticar
      password: "123",
    };

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const response = await request(app).get("/users").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "123.456.789-00", name: "João" }),
        expect.objectContaining({ id: "987.654.321-00", name: "Maria" }),
      ])
    );
  });

  // it("deve retornar status 204 quando não houver usuários cadastrados", async () => {
  //   const login = {
  //     cpf: "987.654.321-00", // Apenas o usuário "ultra" pode autenticar
  //     password: "123",
  //   };

  //   // Criar um usuário "ultra" para autenticação
  //   const ultraUser = {
  //     id: "987.654.321-00",
  //     name: "Maria",
  //     password: "123",
  //     type: "ultra",
  //   };

  //   await request(app).post("/users").send(ultraUser);

  //   const response_login = await request(app).post("/auth/login").send(login);
  //   const token = response_login.body.token;

  //   const response = await request(app).get("/users").set("Authorization", `Bearer ${token}`);

  //   expect(response.status).toBe(204);
  //   expect(response.body).toEqual({});
  // });

  it("deve retornar status 403 quando um usuário comum tentar acessar a lista de usuários", async () => {
    const commonUser = {
      id: "123.456.789-00",
      name: "João",
      password: "123",
      type: "comum",
    };

    await request(app).post("/users").send(commonUser);

    const login = {
      cpf: "123.456.789-00", // Usuário comum tentando autenticar
      password: "123",
    };

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const response = await request(app).get("/users").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Acesso negado. Apenas usuários do(s) tipo(s) ultra pode(m) acessar esta rota." });
  });
});

describe("UserController - getUserById", () => {
  it("deve retornar status 200 e um objeto de usuário", async () => {
    const newUser = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
      type: "comum",
    };
  
    await request(app).post("/users").send(newUser);

    const login = {
      cpf: "123.456.789-00",
      password: "123",
    };

    const response_login = await request(app).post("/auth/login").send(login);

    const token = response_login.body.token;

    const response = await request(app).get("/users/123.456.789-00").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ id: "123.456.789-00", name: "Carlos" }));
  });

  it("deve retornar status 404 quando não existir o usuário cadastrado", async () => {
    const anyUser = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
      type: "ultra",
    };

    await request(app).post("/users").send(anyUser);

    const login = {
      cpf: "123.456.789-00",
      password: "123",
    };

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const response = await request(app).get("/users/987.654.321-00").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual(expect.objectContaining({ "message": "Usuário não encontrado." }));
  });
});


describe("UserController - createUser", () => {
  it("deve retornar status 201 e criar um novo usuário", async () => {
    const newUser = {
      id: "123.456.719-00",
      name: "Carlos",
      password: "123",
      type: "comum",
    };

    const response = await request(app).post("/users").send(newUser);

    expect(response.status).toBe(201);
  
    const expectedUser = {
      id: "123.456.719-00",
      name: "Carlos",
      type: "comum",
    };
  
    expect(response.body).toEqual(expect.objectContaining(expectedUser));
  });

  it("deve retornar status 409 ao tentar criar um usuário com id já existente", async () => {
    const existingUser = {
      id: "123.456.719-00",
      name: "Carlos",
      password: "123",
      type: "comum",
    };

    await request(app).post("/users").send(existingUser);

    const response = await request(app).post("/users").send(existingUser);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "Um usuário com este CPF já existe." });
  });

  it("deve retornar status 400 ao tentar criar um usuário com id inválido", async () => {
    const invalidUser = {
      id: "12345678900", // CPF sem formatação
      name: "Carlos",
      password: "123",
      type: "comum",
    };

    const response = await request(app).post("/users").send(invalidUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "O campo CPF deve estar no formato XXX.XXX.XXX-XX.",
    });
  });

  it("deve retornar status 400 ao tentar criar um usuário sem id", async () => {
    const userWithoutId = {
      name: "Carlos",
      password: "123",
      type: "comum",
    };

    const response = await request(app).post("/users").send(userWithoutId);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "O campo CPF é obrigatório." });
  });

  it("deve retornar status 400 ao tentar criar um usuário sem name", async () => {
    const userWithoutName = {
      id: "123.456.789-00",
      password: "123",
      type: "comum",
    };

    const response = await request(app).post("/users").send(userWithoutName);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "O campo nome é obrigatório." });
  });

  it("deve retornar status 400 ao tentar criar um usuário sem password", async () => {
    const userWithoutPassword = {
      id: "123.456.789-00",
      name: "Carlos",
      type: "comum",
    };

    const response = await request(app).post("/users").send(userWithoutPassword);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "O campo senha é obrigatório." });
  });

  it("deve retornar status 400 ao tentar criar um usuário sem type", async () => {
    const userWithoutType = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
    };

    const response = await request(app).post("/users").send(userWithoutType);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "O campo tipo é obrigatório." });
  });
});


describe("UserController - editUser", () => {
  it("deve retornar status 201 e um objeto de usuário", async () => {
    const newUser = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
      type: "comum",
    };

    await request(app).post("/users").send(newUser);

    const login = {
      cpf: "123.456.789-00",
      password: "123",
    };

    const response_login = await request(app).post("/auth/login").send(login);

    const token = response_login.body.token;

    const updatedUser = {
      name: "José Carlos",
      password: "123",
      type: "comum",
    };

    const response = await request(app)
      .put("/users/123.456.789-00")
      .send(updatedUser)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({ id: "123.456.789-00", name: "José Carlos" })
    );
  });

  it("deve retornar status 404 ao tentar editar um usuário não cadastrado", async () => {
    const ultraUser = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
      type: "ultra",
    };

    await request(app).post("/users").send(ultraUser);

    const login = {
      cpf: "123.456.789-00",
      password: "123",
    };

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const updatedUser = {
      name: "José Carlos",
      password: "123",
      type: "comum",
    };

    const response = await request(app)
      .put("/users/987.654.321-22")
      .send(updatedUser)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Usuário não encontrado." });
  });

  it("deve retornar status 400 ao tentar editar um usuário com ID inválido", async () => {
    const anyUser = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
      type: "ultra",
    };

    await request(app).post("/users").send(anyUser);

    const login = {
      cpf: "123.456.789-00",
      password: "123",
    };

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const updatedUser = {
      name: "José Carlos",
      password: "123",
      type: "comum",
    };

    const response = await request(app)
      .put("/users/12345678900") 
      .send(updatedUser)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "O campo CPF deve estar no formato XXX.XXX.XXX-XX.",
    });
  });

  it("deve retornar status 400 ao tentar editar um usuário sem name", async () => {
    const newUser = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
      type: "comum",
    };

    await request(app).post("/users").send(newUser);

    const login = {
      cpf: "123.456.789-00",
      password: "123",
    };

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const updatedUser = {
      password: "123",
      type: "comum",
    };

    const response = await request(app)
      .put("/users/123.456.789-00")
      .send(updatedUser)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "O campo nome é obrigatório." });
  });

  it("deve retornar status 400 ao tentar editar um usuário sem senha", async () => {
    const newUser = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
      type: "comum",
    };

    await request(app).post("/users").send(newUser);

    const login = {
      cpf: "123.456.789-00",
      password: "123",
    };

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const updatedUser = {
      name: "José Carlos",
      type: "comum",
    };

    const response = await request(app)
      .put("/users/123.456.789-00")
      .send(updatedUser)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "O campo senha é obrigatório." });
  });

  it("deve retornar status 400 ao tentar editar um usuário sem tipo", async () => {
    const newUser = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
      type: "comum",
    };

    await request(app).post("/users").send(newUser);

    const login = {
      cpf: "123.456.789-00",
      password: "123",
    };

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const updatedUser = {
      name: "José Carlos",
      password: "123",
    };

    const response = await request(app)
      .put("/users/123.456.789-00")
      .send(updatedUser)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "O campo tipo é obrigatório." });
  });
});

describe("UserController - deleteUser", () => {
  it("deve retornar status 204 ao deletar um usuário existente", async () => {
    const newUser = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
      type: "comum",
    };

    await request(app).post("/users").send(newUser);

    const login = {
      cpf: "123.456.789-00",
      password: "123",
    };

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const response = await request(app)
      .delete("/users/123.456.789-00")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("deve retornar status 404 ao tentar deletar um usuário não cadastrado", async () => {
    const ultraUser = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
      type: "ultra",
    };

    await request(app).post("/users").send(ultraUser);

    const login = {
      cpf: "123.456.789-00",
      password: "123",
    };

    const response_login = await request(app).post("/auth/login").send(login);
    const token = response_login.body.token;

    const response = await request(app)
      .delete("/users/987.654.321-00")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Usuário não encontrado." });
  });
});
