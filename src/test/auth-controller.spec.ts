import { expect } from "chai";
import conn from "../database";
import { Model } from "../interfaces/model";
import { hashPassword } from "../util/hashing";

import { signup, login } from "../controllers/auth";

after(async () => {
    await conn(Model.user).delete();
    conn.destroy();
});
describe("Auth controller - signup", function () {
    before(async () => {
        await conn.migrate.latest();
    });
    after(async () => {
        await conn(Model.user).delete();
    });

    it("should return a 201 status when user signs up successfully", function (done) {
        const req: any = {
            body: {
                email: "test@test.com",
                password: "password",
                firstname: "test",
                lastname: "test",
            },
        };
        const res: any = {
            statusCode: 500,
            userStatus: null,
            status: function (code: number) {
                this.statusCode = code;
                return this;
            },
            json: function (data: any) {
                this.userStatus = data.status;
            },
        };

        signup(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(201);
            done();
        });
    });

    it("should throw a 403 error if user already exists", function (done) {
        const res: any = {};
        const req: any = {
            body: {
                email: "test@test.com",
                password: "password",
                firstname: "test",
                lastname: "test",
            },
        };

        signup(req, res, () => {}).then((result) => {
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 403);
            done();
        });
    });
});

describe("Auth controller - login", function () {
    before(async () => {
        await conn.migrate.latest();

        const hashedPassword = await hashPassword("test");
        await conn(Model.user).insert({
            first_name: "test",
            last_name: "test",
            email: "logintest@test.com",
            password: hashedPassword,
        });
    });

    after(async () => {
        await conn(Model.user).delete();
    });

    it("should return a 201 status when user logs in successfully", function (done) {
        const req: any = {
            body: {
                email: "logintest@test.com",
                password: "test",
            },
        };
        const res: any = {
            statusCode: 500,
            userStatus: null,
            status: function (code: number) {
                this.statusCode = code;
                return this;
            },
            json: function (data: any) {
                this.userStatus = data.status;
            },
        };

        login(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(201);
            done();
        });
    });
    it("should throw a 401 error when password is incorrect", function (done) {
        const req: any = {
            body: {
                email: "logintest@test.com",
                password: "incorrect",
            },
        };
        const res: any = {
            statusCode: 500,
            userStatus: null,
            status: function (code: number) {
                this.statusCode = code;
                return this;
            },
            json: function (data: any) {
                this.userStatus = data.status;
            },
        };

        login(req, res, () => {}).then((result) => {
            console.log(result);
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 401);
            done();
        });
    });
    it("should throw a 401 error when user doesn't exist", function (done) {
        const req: any = {
            body: {
                email: "wrong@test.com",
                password: "test",
            },
        };
        const res: any = {
            statusCode: 500,
            userStatus: null,
            status: function (code: number) {
                this.statusCode = code;
                return this;
            },
            json: function (data: any) {
                this.userStatus = data.status;
            },
        };

        login(req, res, () => {}).then((result) => {
            console.log(result);
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 401);
            done();
        });
    });
});
