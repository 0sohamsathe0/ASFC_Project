import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";

import playerRouter from "./routes/player-router.js";

dotenv.config();
const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/player", playerRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

mongoose.connect(process.env.mongodb_connection_string).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
  console.log("Connected!");
});
