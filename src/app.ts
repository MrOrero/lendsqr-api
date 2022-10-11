import express from "express";
import walletRoutes from "./routes/wallet";
import authRoutes from "./routes/auth";
import { errorHandler } from "./middleware/error-handler";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/wallet", walletRoutes);

app.use(errorHandler);

app.listen(3000);
