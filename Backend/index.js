import exprees from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import playerRouter from "./routes/player-router.js";

dotenv.config();
const app = exprees();


app.use(exprees.json());
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
