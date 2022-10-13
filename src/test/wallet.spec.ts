import { expect, use } from "chai";
import conn from "../database";
import { Model } from "../interfaces/model";
import { hashPassword } from "../util/hashing";

import {
    createWallet,
    fundWallet,
    getTransactions,
    getWallet,
    transferFunds,
    withdrawFunds,
} from "../controllers/wallet";
import IWallet from "../interfaces/wallet";
let userId: any;
after(async () => {
    conn.destroy();
});
describe("Wallet controller - create wallet", function () {
    before(async () => {
        await conn.migrate.latest();
        const hashedPassword = await hashPassword("test");

        userId = await conn(Model.user).insert({
            first_name: "test",
            last_name: "test",
            email: "wallettest@test.com",
            password: hashedPassword,
        });
    });

    it("should return a 201 status when wallet is created successfully", function (done) {
        const req: any = {
            userId: +userId,
            body: {
                pin: "2022",
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

        createWallet(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(201);
            done();
        });
    });

    it("should throw a 403 error if wallet already exists", function (done) {
        const res: any = {};
        const req: any = {
            userId: +userId,
            body: {
                pin: "2022",
            },
        };

        createWallet(req, res, () => {}).then((result) => {
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 403);
            done();
        });
    });
});
describe("Wallet controller - get wallet", function () {
    before(async () => {
        await conn.migrate.latest();
    });
    it("should return a 200 status when getting wallet successfully", function (done) {
        const req: any = {
            userId: +userId,
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

        getWallet(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });

    it("should throw a 401 error if wallet can't be found", function (done) {
        const res: any = {};
        const req: any = {
            userId: 9999999999,
            body: {
                pin: "2022",
            },
        };

        getWallet(req, res, () => {}).then((result) => {
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 401);
            done();
        });
    });
});
describe("Wallet controller - fund wallet", function () {
    before(async () => {
        await conn.migrate.latest();
    });

    it("should return a 200 status when funding wallet successfully", function (done) {
        const req: any = {
            userId: +userId,
            body: {
                pin: "2022",
                amount: 500,
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

        fundWallet(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });

    it("should throw a 401 error if wallet can't be found", function (done) {
        const res: any = {};
        const req: any = {
            userId: 9999999999,
            body: {
                pin: "2022",
            },
        };

        fundWallet(req, res, () => {}).then((result) => {
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 401);
            done();
        });
    });

    it("should throw a 401 error if pin is incorrect", function (done) {
        const res: any = {};
        const req: any = {
            userId: +userId,
            body: {
                pin: "1111",
            },
        };

        fundWallet(req, res, () => {}).then((result) => {
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 401);
            done();
        });
    });
});

describe("Wallet controller - withdraw wallet", function () {
    before(async () => {
        await conn.migrate.latest();
    });

    it("should return a 200 status when withdrawing from wallet successfully", function (done) {
        const req: any = {
            userId: +userId,
            body: {
                pin: "2022",
                amount: 100,
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

        withdrawFunds(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });

    it("should throw a 401 error if wallet can't be found", function (done) {
        const res: any = {};
        const req: any = {
            userId: 9999999999,
            body: {
                pin: "2022",
                amount: 100,
            },
        };

        withdrawFunds(req, res, () => {}).then((result) => {
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 401);
            done();
        });
    });

    it("should throw a 401 error if pin is incorrect", function (done) {
        const res: any = {};
        const req: any = {
            userId: +userId,
            body: {
                pin: "1111",
                amount: 100,
            },
        };

        withdrawFunds(req, res, () => {}).then((result) => {
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 401);
            done();
        });
    });

    it("should throw a 400 error if balance is insufficient", function (done) {
        const res: any = {};
        const req: any = {
            userId: +userId,
            body: {
                pin: "2022",
                amount: 10000,
            },
        };

        withdrawFunds(req, res, () => {}).then((result) => {
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 400);
            done();
        });
    });
});

describe("Wallet controller - transfer wallet", function () {
    let senderWalletNumber: string;
    let walletNumber: string = "1234567890";
    before(async () => {
        const number = (
            await conn<IWallet>(Model.wallet)
                .where("user_id", userId[0])
                .select("wallet_number")
        )[0];

        senderWalletNumber = number.wallet_number;

        const hashedPassword = await hashPassword("test");
        const recipientId = await conn(Model.user).insert({
            first_name: "test",
            last_name: "test",
            email: "wallettest2@test.com",
            password: hashedPassword,
        });

        await conn<IWallet>(Model.wallet).insert({
            pin: "0000",
            wallet_number: walletNumber,
            user_id: recipientId[0],
        });
    });

    it("should return a 200 status when transferring successfully", function (done) {
        const req: any = {
            userId: +userId[0],
            body: {
                recipientWallet: walletNumber,
                pin: "2022",
                amount: 50,
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

        transferFunds(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });

    it("should throw a 401 error if wallet can't be found", function (done) {
        const res: any = {};
        const req: any = {
            userId: 9999999999,
            body: {
                recipientWallet: walletNumber,
                pin: "2022",
                amount: 100,
            },
        };

        transferFunds(req, res, () => {}).then((result) => {
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 401);
            done();
        });
    });

    it("should throw a 401 error if pin is incorrect", function (done) {
        const res: any = {};
        const req: any = {
            userId: +userId,
            body: {
                recipientWallet: walletNumber,
                pin: "1111",
                amount: 100,
            },
        };

        transferFunds(req, res, () => {}).then((result) => {
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 401);
            done();
        });
    });

    it("should throw a 400 error if balance is insufficient", function (done) {
        const res: any = {};
        const req: any = {
            userId: +userId,
            body: {
                recipientWallet: walletNumber,
                pin: "2022",
                amount: 10000,
            },
        };

        transferFunds(req, res, () => {}).then((result) => {
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 400);
            done();
        });
    });

    it("should return a 403 error if user tries to transfer to themself", function (done) {
        const res: any = {};
        const req: any = {
            userId: +userId,
            body: {
                recipientWallet: senderWalletNumber,
                pin: "2022",
                amount: 20,
            },
        };

        transferFunds(req, res, () => {}).then((result) => {
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 403);
            done();
        });
    });
});

describe("Wallet controller - transactions", function () {
    after(async () => {
        await conn(Model.wallet).delete();
        await conn(Model.user).delete();
    });

    it("should return a 200 status when get transaction details successful", function (done) {
        const req: any = {
            userId: +userId,
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

        getTransactions(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });

    it("should throw a 401 error if wallet can't be found", function (done) {
        const res: any = {};
        const req: any = {
            userId: 9999999999,
        };

        getTransactions(req, res, () => {}).then((result) => {
            expect(result).be.an("error");
            expect(result).to.have.property("statusCode", 401);
            done();
        });
    });
});
