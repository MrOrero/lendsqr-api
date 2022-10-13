import fs from "fs";
import path from "path";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import walletRoutes from "./routes/wallet";
import authRoutes from "./routes/auth";
import { errorHandler } from "./middleware/error-handler";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/wallet", walletRoutes);

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
);

app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(errorHandler);

app.listen(process.env.PORT || 3000);
