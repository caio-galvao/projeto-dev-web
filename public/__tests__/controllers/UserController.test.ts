import * as request from "supertest";
import app from "../../src/index";
import sequelize from "../../src/config/database";

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // TODO BD separado
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
  }
});

afterAll(async () => {
  await sequelize.close();
  console.log("📌 Conexão com o banco fechada.");
});

/* describe("UserController - getAllUsers", () => {
  beforeEach(async () => {
    // Opcional: limpar o banco antes de cada teste
    await sequelize.truncate({ cascade: true });
  });

  it("deve retornar status 200 e uma lista de usuários", async () => {

    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "123.456.789-00", name: "João" }),
        expect.objectContaining({ id: "987.654.321-00", name: "Maria" }),
      ])
    );
  });

  it("deve retornar status 204 quando não houver usuários", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  afterAll(async () => {
    await sequelize.close(); // Fecha a conexão com o BD
    console.log("📌 Conexão com o banco fechada.");
  });
});
 */

describe("UserController - createUser", () => {
  it("deve retornar status 201 e criar um novo usuário", async () => {
    const newUser = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
      type: "comum",
    };

    const response = await request(app).post("/users").send(newUser);

    expect(response.status).toBe(201);
  
    const expectedUser = {
      id: "123.456.789-00",
      name: "Carlos",
      type: "comum",
    };
  
    expect(response.body).toEqual(expect.objectContaining(expectedUser));
  });
});

// describe("UserController - getUserById", () => {
//   it("deve retornar status 200 e um objeto de usuário", async () => {
//     const newUser = {
//       id: "123.456.789-00",
//       name: "Carlos",
//       password: "123",
//       type: "comum",
//     };
  
//     await request(app).post("/users").send(newUser);

//     const login = {
//       cpf: "123.456.789-00",
//       password: "123",
//     };

//     const response_login = await request(app).post("/auth/login").send(login);

//     const token = response_login.body.token;

//     const response = await request(app).get("/users/123.456.789-00").set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(
//       expect.objectContaining({ id: "123.456.789-00", name: "Carlos" }),
//       )
//   });
// });

// describe("UserController - edit user", () => {
//   it("deve retornar status 201 e um objeto de usuário", async () => {
//     const newUser = {
//       id: "123.456.789-00",
//       name: "Carlos",
//       password: "123",
//       type: "comum",
//     };
  
//     await request(app).post("/users").send(newUser);

//     const login = {
//       cpf: "123.456.789-00",
//       password: "123",
//     };

//     const response_login = await request(app).post("/auth/login").send(login);

//     const token = response_login.body.token;
  
//     const updatedUser = {
//       name: "José Carlos",
//       password: "123",
//       type: "comum",
//     };

//     const response = await request(app).put("/users/123.456.789-00").send(updatedUser).set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(201);
//     expect(response.body).toEqual(
//       expect.objectContaining({ id: "123.456.789-00", name: "José Carlos" }),
//       )
//   });
// });


/*   it("deve retornar status 400 quando o CPF não for fornecido", async () => {
    const newUser = {
      name: "Carlos",
      password: "123",
      type: "comum",
    };

    const response = await request(app).post("/users").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "O campo CPF é obrigatório." });
  });

  it("deve retornar status 400 quando o nome não for fornecido", async () => {
    const newUser = {
      id: "123.456.789-00",
      password: "123",
      type: "comum",
    };

    const response = await request(app).post("/users").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "O campo nome é obrigatório." });
  });

  it("deve retornar status 400 quando a senha não for fornecida", async () => {
    const newUser = {
      id: "123.456.789-00",
      name: "Carlos",
      type: "comum",
    };

    const response = await request(app).post("/users").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "O campo senha é obrigatório." });
  });

  it("deve retornar status 400 quando o tipo não for fornecido", async () => {
    const newUser = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
    };

    const response = await request(app).post("/users").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "O campo tipo é obrigatório." });
  });

  it("deve retornar status 400 quando o CPF estiver no formato incorreto", async () => {
    const newUser = {
      id: "12345678900", // CPF sem formatação
      name: "Carlos",
      password: "123",
      type: "comum",
    };

    const response = await request(app).post("/users").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "O campo CPF deve estar no formato XXX.XXX.XXX-XX.",
    });
  });

  it("deve retornar status 409 quando o CPF já existir", async () => {
    const existingUser = {
      id: "123.456.789-00",
      name: "Carlos",
      password: "123",
      type: "comum",
    };

    // Inserir um usuário existente
    await sequelize.query(`
      INSERT INTO users (id, name, password, type)
      VALUES ('123.456.789-00', 'Carlos', '123', 'comum');
    `);

    const response = await request(app).post("/users").send(existingUser);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "Um usuário com este CPF já existe." });
  });

  afterAll(async () => {
    await sequelize.close();
    console.log("📌 Conexão com o banco fechada.");
  });
*/
 