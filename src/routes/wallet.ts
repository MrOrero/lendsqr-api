import { Router } from "express";
import {
    createWallet,
    getWallet,
    fundWallet,
    withdrawFunds,
    transferFunds,
    getTransactions,
} from "../controllers/wallet";
import {
    createWalletValidation,
    fundWalletValidation,
    transferFundValidation,
    withdrawFundValidation,
} from "../validation/wallet-validation";

import isAuth from "../middleware/is-auth";

const router = Router();

router.get("/details", isAuth, getWallet);

router.get("/transactions", isAuth, getTransactions);

router.post("/create", isAuth, createWalletValidation(), createWallet);

router.post("/deposit", isAuth, fundWalletValidation(), fundWallet);

router.post("/withdraw", isAuth, withdrawFundValidation(), withdrawFunds);

router.post("/transfer", isAuth, transferFundValidation(), transferFunds);

export default router;
