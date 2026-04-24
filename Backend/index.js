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


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "http://localhost:5173", credentials: true, }));
app.use(cookieParser());


app.use("/player", playerRouter);
app.use("/admin", adminRouter);
app.use("/tournament", tournamentRouter)
app.use("/result", resultRouter)

app.get("/", (req, res) => {
  res.send("Hello World");
});


const startServer = async () => {
  try {
    await mongoose.connect(process.env.mongodb_connection_string);

    console.log("✅ MongoDB Connected");

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });

  } catch (err) {
    console.log("❌ DB Connection Failed");
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