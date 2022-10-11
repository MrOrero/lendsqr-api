import { body } from "express-validator";
import conn from "../database";
import IUser from "../interfaces/user";
import { Model } from "../interfaces/model";
import { comparePassword } from "../util/hashing";

export const signupValidation = () => {
    return [
        body("firstname", "Please enter a valid firstname")
            .isAlpha()
            .withMessage("First name must have only be alphabets")
            .ltrim()
            .rtrim()
            .isLength({ min: 2 })
            .withMessage("First name must have a minimum of 2 alphabets"),
        body("lastname", "Please enter a valid lastname")
            .isAlpha()
            .withMessage("Last name must have only be alphabets")
            .ltrim()
            .rtrim()
            .isLength({ min: 2 })
            .withMessage("Last name must have a minimum of 2 alphabets"),
        body("email", "Please enter a valid email")
            .isEmail()
            .withMessage("Please provide a valid email")
            .normalizeEmail(),

        body("password", "Please enter a valid password")
            .notEmpty()
            .withMessage("Password must not be empty")
            .trim()
            .isLength({ min: 5, max: 25 })
            .withMessage("Password must be between 5 to 25 characters"),
    ];
};

export const loginValidation = () => {
    return [
        body("email", "Please enter a valid email")
            .isEmail()
            .withMessage("Please provide a valid email"),
        body("password", "Please enter a valid password")
            .notEmpty()
            .withMessage("Please provide a password")
            .trim(),
    ];
};
