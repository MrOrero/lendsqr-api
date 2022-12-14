import { Request, Response, NextFunction } from "express";
import { customAlphabet } from "nanoid";
import { validationResult } from "express-validator";
import conn from "../database";
import { insert } from "../util/db-insert";
import formatWalletDetails from "../util/format-wallet-details";
import { formatValidationError, formatCustomError } from "../util/format-error";
import walletInsertData from "../interfaces/wallet-insert-data";
import IWallet from "../interfaces/wallet";
import IWalletDetails from "../interfaces/wallet-details";
import { Model } from "../interfaces/model";
import ITransaction from "../interfaces/transaction";
import IUser from "../interfaces/user";
const knex_populate = require("knex-populate");

const nanoId = customAlphabet("0123456789", 10);

export const createWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(formatValidationError(errors.array()));
    }

    try {
        const { pin } = req.body;

        const walletId: { id: number } = (
            await conn<IWallet>(Model.wallet)
                .where("user_id", +req.userId)
                .select("id")
        )[0];

        // Check if User has already created a wallet
        if (walletId) {
            throw formatCustomError("This user already has a wallet", 403);
        }

        //generate wallet number
        const walletNumber = nanoId();

        const data: walletInsertData = {
            wallet_number: walletNumber,
            pin: pin,
            user_id: +req.userId,
        };

        const wallet: number = (await insert(Model.wallet, data))[0];

        //Wallet variable returns an array with the created wallet id,
        // which we use to query all details from the database
        const createdWallet: IWallet[] = await conn<IWallet>(Model.wallet)
            .where("id", wallet)
            .select("balance", "wallet_number", "pin", "user_id");

        res.status(201).json({
            message: `Wallet sucessfully Created, your pin has been sucessfully created and your wallet number is ${createdWallet[0].wallet_number}`,
            data: createdWallet,
        });
        return;
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        console.log(error);
        next(error);
        return error;
    }
};

export const getWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Check if wallet exists
        const wallet: { id: number } = (
            await conn<IWallet>(Model.wallet)
                .where("user_id", +req.userId)
                .select("id")
        )[0];

        if (!wallet) {
            throw formatCustomError(
                "You do not yet have a wallet, head over and create one",
                401
            );
        }

        // Knex_populate poulates the userId field with an array of user details pertaining to the user
        // It is structured like this
        // {
        //     "walletNumber": "0983499396",
        //     "walletBalance": "2500.00",
        //     "wallet": [
        //         {
        //             "firstName": "orero",
        //             "lastName": "ozore",
        //             "email": "oreroozore@gmail.com"
        //         }
        //     ]
        // }
        const walletDetails: IWalletDetails[] = await knex_populate(
            conn,
            Model.wallet
        )
            .findById(wallet.id)
            .populate("user", "user_id")
            .exec();

        const formattedWalletDetails = formatWalletDetails(walletDetails);
        res.status(200).json({
            data: formattedWalletDetails,
        });
        return;
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        console.log(error);
        next(error);
        return error;
    }
};

export const fundWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(formatValidationError(errors.array()));
    }

    const { amount, pin } = req.body;
    try {
        // Check if wallet already exists
        const wallet: IWallet = (
            await conn<IWallet>(Model.wallet)
                .where("user_id", +req.userId)
                .select("*")
        )[0];
        if (!wallet) {
            throw formatCustomError(
                "You do not yet have a wallet, head over and create one",
                401
            );
        }

        if (wallet.pin !== pin) {
            throw formatCustomError("Incorrect Pin", 401);
        }
        const updatedBalance = +wallet.balance + +amount;

        // Update wallet with new balance
        await conn<IWallet>(Model.wallet)
            .where({ id: wallet.id })
            .update({ balance: updatedBalance });

        const updatedWallet: IWalletDetails[] = await knex_populate(
            conn,
            Model.wallet
        )
            .findById(wallet.id)
            .populate("user", "user_id")
            .exec();

        const formattedWalletDetails = formatWalletDetails(updatedWallet);
        res.status(200).json({
            message: "Wallet funded Sucessfully",
            data: formattedWalletDetails,
        });
        return;
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        console.log(error);
        next(error);
        return error;
    }
};

export const withdrawFunds = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(formatValidationError(errors.array()));
    }

    const { amount, pin } = req.body;
    try {
        // Check if wallet already exists
        const wallet: IWallet = (
            await conn<IWallet>(Model.wallet)
                .where("user_id", +req.userId)
                .select("*")
        )[0];
        if (!wallet) {
            throw formatCustomError(
                "You do not yet have a wallet, head over and create one",
                401
            );
        }

        if (wallet.pin !== pin) {
            throw formatCustomError("Incorrect Pin", 401);
        }

        if (+wallet.balance < amount) {
            throw formatCustomError("Insufficient Balance", 400);
        }
        const debitedBalance = +wallet.balance - +amount;

        await conn<IWallet>(Model.wallet)
            .where({ id: wallet.id })
            .update({ balance: debitedBalance });

        const updatedWallet: IWalletDetails[] = await knex_populate(
            conn,
            Model.wallet
        )
            .findById(wallet.id)
            .populate("user", "user_id")
            .exec();

        const formattedWalletDetails = formatWalletDetails(updatedWallet);
        res.status(200).json({
            message: "Withdrawal Sucessful",
            data: formattedWalletDetails,
        });
        return;
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        console.log(error);
        next(error);
        return error;
    }
};

export const transferFunds = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(formatValidationError(errors.array()));
    }

    const { amount, pin, recipientWallet } = req.body;
    try {
        const senderWallet: IWallet = (
            await conn<IWallet>(Model.wallet)
                .where("user_id", +req.userId)
                .select("*")
        )[0];
        if (!senderWallet) {
            throw formatCustomError(
                "You do not yet have a wallet, head over and create one",
                401
            );
        }

        if (senderWallet.pin !== pin) {
            throw formatCustomError("Incorrect Pin", 401);
        }

        if (+senderWallet.balance < amount) {
            throw formatCustomError("Insufficient Balance", 400);
        }
        if (+senderWallet.wallet_number === +recipientWallet) {
            throw formatCustomError("You cannot transfer to yourself", 403);
        }

        // get recipient account
        const recipientWalletDetails: IWallet = (
            await conn<IWallet>(Model.wallet)
                .where({ wallet_number: recipientWallet })
                .select("*")
        )[0];

        let formattedWalletDetails;
        let recipient: { first_name: string } | undefined;
        await conn.transaction(async (trx) => {
            await trx<IWallet>(Model.wallet)
                .where({ user_id: +req.userId })
                .update({ balance: +senderWallet.balance - +amount });

            const updatedSenderWallet = (
                await trx<IWallet>(Model.wallet)
                    .where({ user_id: +req.userId })
                    .select("*")
            )[0];

            await trx<IWallet>(Model.wallet)
                .where({ wallet_number: recipientWallet })
                .update({
                    balance: +recipientWalletDetails.balance + +amount,
                });

            const updatedRecieverWallet = (
                await trx<IWallet>(Model.wallet)
                    .where({ wallet_number: recipientWallet })
                    .select("*")
            )[0];

            await trx<ITransaction>(Model.transaction).insert({
                sender_id: +senderWallet.id,
                reciever_id: +recipientWalletDetails.id,
                amount: amount,
            });
            const walletDetails: IWalletDetails[] = await knex_populate(
                trx,
                Model.wallet
            )
                .findById(updatedSenderWallet.id)
                .populate("user", "user_id")
                .exec();

            formattedWalletDetails = formatWalletDetails(walletDetails);

            recipient = (
                await trx<IUser>(Model.user)
                    .where({ id: +updatedRecieverWallet.user_id })
                    .select("first_name")
            )[0];
        });

        res.status(200).json({
            message: `You have successfully transferred ${amount} to ${
                recipient!.first_name
            }`,
            data: formattedWalletDetails,
        });
        return;
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        console.log(error);
        next(error);
        return error;
    }
};
export const getTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const walletId = (
            await conn<IWallet>(Model.wallet)
                .where("user_id", +req.userId)
                .select("id")
        )[0];

        if (!walletId) {
            throw formatCustomError(
                "You do not yet have a wallet, head over and create one",
                401
            );
        }

        const updatedSenderWallet = await conn<ITransaction>(Model.transaction)
            .where(function () {
                this.where("sender_id", walletId.id).orWhere(
                    "reciever_id",
                    walletId.id
                );
            })
            .select("*");

        if (updatedSenderWallet.length === 0) {
            throw formatCustomError("No transaction details", 401);
        }

        const formattedWallet = updatedSenderWallet.map(async (wallet) => {
            if (wallet.sender_id === +walletId.id) {
                //If the current user is the one that did the transfer, get details of the reciever
                const recieverWallet = (
                    await conn<IWallet>(Model.wallet)
                        .select("wallet_number", "user_id")
                        .where("id", wallet.reciever_id)
                )[0];
                const reciever = (
                    await conn<IUser>(Model.user)
                        .select("first_name")
                        .where("id", recieverWallet.user_id)
                )[0];
                return {
                    amount: wallet.amount,
                    reference: reciever.first_name,
                    wallet_number: recieverWallet.wallet_number,
                    type: "debit",
                };
            }
            if (wallet.reciever_id === +walletId.id) {
                //If the current user is the one that recieved the transfer, get details of the sender
                const senderWallet = (
                    await conn<IWallet>(Model.wallet)
                        .select("wallet_number", "user_id")
                        .where("id", wallet.sender_id)
                )[0];
                const sender = (
                    await conn<IUser>(Model.user)
                        .select("first_name")
                        .where("id", senderWallet.user_id)
                )[0];
                return {
                    amount: wallet.amount,
                    reference: sender.first_name,
                    wallet_number: senderWallet.wallet_number,
                    type: "credit",
                };
            }
        });
        const result = await Promise.all(formattedWallet);
        // console.log(result);
        res.status(200).json(result);
        return;
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        console.log(error);
        next(error);
        return error;
    }
};
