import { ValidationError } from "express-validator";

export const formatValidationError = (data: ValidationError[]) => {
    const formatedError: any = new Error("Validation Failed");
    formatedError.statusCode = 422;
    formatedError.data = data;

    return formatedError;
};

export const formatCustomError = (message: string, statusCode: number) => {
    const formatedError: any = new Error(message);
    formatedError.statusCode = statusCode;
    return formatedError;
};
