import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import isAuth from "../middleware/is-auth";

describe("Auth middleware Error test", function () {
    let stub: any;
    before(function () {
        stub = sinon.stub(jwt, "verify");
        let error: any = new Error();
        error.message = "jwt expired";
        stub.throws(error);
    });

    after(function () {
        stub.restore();
    });

    it("should throw an error if no authorization header is present", function () {
        let res: any;
        const req: any = {
            get: function (headerName: string) {
                return null;
            },
        };

        expect(isAuth.bind(this, req, res, () => {})).to.throw(
            "Not Authenticated"
        );
    });

    it("should throw an error if the authorization header is only one string", function () {
        let res: any;
        const req: any = {
            get: function (headerName: string) {
                return "null";
            },
        };

        expect(isAuth.bind(this, req, res, () => {})).throw();
    });

    it("Should throw an error of the token can not be verified", function () {
        let res: any;
        const req: any = {
            get: function (headerName: string) {
                return "Bearer xyz";
            },
        };

        expect(isAuth.bind(this, req, res, () => {})).throw();
    });

    it("should throw a custom error if jwt expires", function () {
        let res: any;
        const req: any = {
            get: function (headerName: string) {
                return "Bearer xyz";
            },
        };

        expect(isAuth.bind(this, req, res, () => {})).throw(
            "Your Session has expired, log in again"
        );
    });
});

describe("Auth middleware functionality test", function () {
    let stub: any;
    before(function () {
        stub = sinon.stub(jwt, "verify");
        stub.returns({ userId: "1" });
    });

    after(function () {
        stub.restore();
    });

    it("should yield a userId after decoding the token", function () {
        let res: any;
        const req: any = {
            get: function (headerName: string) {
                return "Bearer xyz";
            },
        };

        isAuth(req, res, () => {});
        expect(req).to.have.property("userId");
    });
});
