import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import conn from "../database";
import signJwt from "../util/sign-jwt";
import { hashPassword } from "../util/hashing";
import { comparePassword } from "../util/hashing";
import { insert } from "../util/db-insert";
import { formatValidationError, formatCustomError } from "../util/format-error";
import IUser from "../interfaces/user";
import UserInsertData from "../interfaces/user-insert-data";
import { Model } from "../interfaces/model";

type RequestBody = {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
};

export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(formatValidationError(errors.array()));
    }
    const { email, password, firstname, lastname } = req.body as RequestBody;
    try {
        // Check if user is already signed up
        const existingUser: IUser[] = await conn<IUser>(Model.user).where({
            email: email,
        });
        if (existingUser.length !== 0) {
            return next(formatCustomError("This user already exists", 403));
        }

        //Encrypt password before saving in database
        const hashedPassword = await hashPassword(password, 10);
        // Insert User into DB
        const data: UserInsertData = {
            first_name: firstname,
            last_name: lastname,
            email: email,
            password: hashedPassword,
        };

        const user: number[] = await insert(Model.user, data);

        console.log(user);

        //user variable returns an array with the created user id,
        // which we use to query all details from the database
        const createdUser: IUser[] = await conn<IUser>(Model.user)
            .where("id", user[0])
            .select("first_name", "email", "last_name", "id");

        res.status(201).json({
            message: `Welcome '${createdUser[0].first_name}, you have been succesfully signed up`,
            data: createdUser,
        });
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        console.log(error);
        return next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(formatValidationError(errors.array()));
    }
    const { email, password } = req.body as RequestBody;
    try {
        // Check if user exists
        const user: IUser = (
            await conn<IUser>(Model.user)
                .where({
                    email: email,
                })
                .select("*")
        )[0];
        if (!user) {
            return next(formatCustomError("Invalid Email or Password", 401));
        }

        //Check if password is equals to hashed password in the database
        const isEqual = await comparePassword(password, user.password);
        if (!isEqual) {
            return next(formatCustomError("Incorrect Email or Password", 401));
        }

        //Sign token that we use for authentication
        const token = signJwt(user.email, user.id.toString());

        res.status(201).json({
            message: `Welcome '${user.first_name}, you have been succesfully logged in}`,
            token: token,
            data: {
                firstname: user.first_name,
                lastname: user.last_name,
                email: user.email,
            },
        });
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        console.log(error);
        return next(error);
    }
};
