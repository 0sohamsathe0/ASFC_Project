import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";


import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";

import playerRouter from "./routes/player-router.js";
import adminRouter from "./routes/admin-router.js";
import tournamentRouter from "./routes/tournament-router.js"
import resultRouter from "./routes/result-router.js";

import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

dotenv.config();
const app = express();

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
  console.log("Incoming Origin:", req.headers.origin);
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
  console.log("Incoming:", req.method, req.originalUrl);
  next();
});

app.use("/player", playerRouter);
app.use("/admin", adminRouter);
app.use("/tournament", tournamentRouter)
app.use("/result", resultRouter)

app.get("/", (req, res) => {
  res.send("ASFC Backend is running !!");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.mongodb_connection_string);

    console.log("MongoDB Connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
      console.log("HOST_IP:", process.env.HOST_IP);
      console.log("Allowed Origins:", allowedOrigins);
    });

  } catch (err) {
    console.log("DB Connection Failed");
    console.log(err.message);

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