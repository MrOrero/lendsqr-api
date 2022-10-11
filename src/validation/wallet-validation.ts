import { body } from "express-validator";

export const createWalletValidation = () => {
    return [
        body("pin")
            .notEmpty()
            .withMessage("Please provide a pin")
            .isNumeric()
            .withMessage("Pin must be numeric")
            .isLength({ min: 4, max: 4 })
            .withMessage("Pin must be 4 numbers"),
    ];
};

export const fundWalletValidation = () => {
    return [
        body("pin")
            .isNumeric()
            .withMessage("Pin must be numeric")
            .isLength({ min: 4, max: 4 })
            .withMessage("Pin must be 4 numbers"),
        body("amount")
            .isNumeric()
            .withMessage("amount must be numeric")
            .notEmpty()
            .withMessage("please provide an amount"),
    ];
};
export const withdrawFundValidation = () => {
    return [
        body("pin")
            .notEmpty()
            .withMessage("Please provide a pin")
            .isNumeric()
            .withMessage("Pin must be numeric")
            .isLength({ min: 4, max: 4 })
            .withMessage("Pin must be 4 numbers"),
        body("amount")
            .isNumeric()
            .withMessage("amount must be numeric")
            .notEmpty()
            .withMessage("please provide an amount"),
    ];
};

export const transferFundValidation = () => {
    return [
        body("amount")
            .isNumeric()
            .withMessage("amount must be numeric")
            .notEmpty()
            .withMessage("please provide an amount"),
        body("recipientWallet")
            .notEmpty()
            .withMessage("please provide recipient account number")
            .isNumeric()
            .withMessage("invalid account number")
            .isLength({ min: 10, max: 10 })
            .withMessage("Wallet number must be 10 digits"),
        body("pin")
            .notEmpty()
            .withMessage("Please provide a pin")
            .isNumeric()
            .withMessage("Pin must be numeric")
            .isLength({ min: 4, max: 4 })
            .withMessage("Pin must be 4 numbers"),
    ];
};
