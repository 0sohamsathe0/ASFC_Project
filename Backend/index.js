import exprees from "express";
import dotenv from "dotenv";


import playerRouter from "./routes/player-router.js";

dotenv.config();
const app = exprees();

app.use("/player", playerRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});