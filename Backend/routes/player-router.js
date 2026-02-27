import express from "express";
import { Router} from "express";    

const playerRouter = Router();

playerRouter.get("/", (req, res) => {
  res.send("Player Router");
});

export default playerRouter;