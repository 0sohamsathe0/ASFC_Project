import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";


import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";

import playerRouter from "./routes/player-router.js";
import adminRouter from "./routes/admin-router.js";
import tournamentRouter from "./routes/tournament-router.js"
import resultRouter from "./routes/result-router.js";
import adminFeeRouter from "./routes/admin-fee-router.js";
import playerFeeRouter from "./routes/player-fee-router.js";
import contactRouter from "./routes/contact-router.js";
import { ensureInitialFeeRate } from "./services/fee-rate-service.js";
import FeeAccount from "./models/fee-account-model.js";
import FeePause from "./models/fee-pause-model.js";
import FeeRate from "./models/fee-rate-model.js";

import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

dotenv.config({ quiet: true });
const app = express();
const isProduction = process.env.NODE_ENV === "production";

// Render terminates TLS at one trusted proxy hop. This keeps req.ip accurate for
// endpoint rate limiting without trusting arbitrary forwarded proxy chains.
app.set("trust proxy", 1);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  strictTransportSecurity: isProduction ? undefined : false,
}));

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
  : [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


app.use((req, res, next) => {
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin
      // Example: Postman, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,

  })
);
app.use(cookieParser());

app.use((req, res, next) => {
  next();
});

app.use("/player", playerRouter);
app.use("/admin", adminRouter);
app.use("/admin/fees", adminFeeRouter);
app.use("/player/fees", playerFeeRouter);
app.use("/tournament", tournamentRouter)
app.use("/result", resultRouter)
app.use(contactRouter);

app.get("/", (req, res) => {
  res.send("ASFC Backend is running !!");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: Date.now(),
    });
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.mongodb_connection_string);

    await Promise.all([FeeAccount.init(), FeePause.init(), FeeRate.init()]);
    await ensureInitialFeeRate();

    console.log("MongoDB Connected");

    app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

  } catch (err) {
    console.log("DB Connection Failed");

    console.log("🔁 Retrying in 3 seconds...");
    setTimeout(startServer, 3000);
  }
};

startServer();


process.on('SIGINT', async () => {
  console.log("🛑 Shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});
