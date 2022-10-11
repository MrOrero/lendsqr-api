import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = error.statusCode || 500;
    if (statusCode === 500) {
        return res.status(statusCode).json({
            message: "Something Unexpected has Occured",
        });
    }
    const message = error.message;
    const data = error.data;
    return res.status(statusCode).json({
        message: message,
        data: data,
    });
};
