import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/index";
import sinon from "sinon";
import { UserService } from "../src/services/userService";
import { beforeEach, describe } from "mocha";

const { expect } = chai;
chai.use(chaiHttp); // Adiciona a extensão de request ao chai

describe("UserController - getAllUsers", () => {
    let userServiceStub: sinon.SinonStub;

    beforeEach(() => {
        userServiceStub = sinon.stub(UserService.prototype, "getAllUsers");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should return all users when users exist", async () => {
        const mockUsers = [
            { id: "123.456.789-00", name: "John Doe", type: "admin" },
            { id: "987.654.321-00", name: "Jane Doe", type: "user" },
        ];
        userServiceStub.resolves(mockUsers);

        const res = await chai.request(app).get("/users");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body).to.deep.equal(mockUsers);
    });

    it("should return 204 when no users exist", async () => {
        userServiceStub.resolves([]);

        const res = await chai.request(app).get("/users");

        expect(res).to.have.status(204);
        expect(res.body).to.be.empty;
    });
});
