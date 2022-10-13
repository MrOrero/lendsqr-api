import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { formatCustomError } from "../util/format-error";

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw formatCustomError("Not Authenticated", 401);
    }
    const token = authHeader.split(" ")[1];
    let decodedToken: any;
    try {
        decodedToken = jwt.verify(token, "secrettokenkey");
    } catch (error: any) {
        console.log(error.message);
        if (error.message === "jwt expired") {
            throw formatCustomError(
                "Your Session has expired, log in again",
                401
            );
        }
        error.statusCode = 500;
        throw error;
    }

    if (!decodedToken) {
        throw formatCustomError("Not Authenticated", 401);
    }

    req.userId = decodedToken.userId;
    next();
};

export default isAuth;
