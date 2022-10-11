import { Router } from "express";
import { signup, login } from "../controllers/auth";
import {
    signupValidation,
    loginValidation,
} from "../validation/auth-validation";

const router = Router();

router.post("/signup", signupValidation(), signup);

router.post("/login", loginValidation(), login);

export default router;
