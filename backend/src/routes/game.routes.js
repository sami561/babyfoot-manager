import { Router } from "express";
import * as game from "../handlers/gameHandlers.js";

const router = new Router();

router
  .get("/games", game.getGames)
  .post("/games", game.createGame)
  .put("/games/:id/finish", game.finishGame)
  .delete("/games/:id", game.deleteGame);

export default router;
