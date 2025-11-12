import * as Game from "../models/Game.js";
import { broadcast } from "../utils/websocket.js";

const json = (res, code, payload) => res.status(code).json(payload);

export const getGames = async (_req, res) => {
  const list = await Game.list();
  res.json(list);
};

export const createGame = async (req, res) => {
  const { player1, player2 } = req.body;
  if (!player1?.trim() || !player2?.trim())
    return json(res, 400, { error: "Both players are required" });

  await Game.insert(player1.trim(), player2.trim());
  broadcast({ type: "update" });
  json(res, 201, { ok: true });
};

export const finishGame = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return json(res, 400, { error: "Invalid id" });
  }

  await Game.finish(id);
  broadcast({ type: "update" });
  return json(res, 200, { ok: true });
};

export const deleteGame = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return json(res, 400, { error: "Invalid id" });

  await Game.remove(id);
  broadcast({ type: "update" });
  return json(res, 200, { ok: true });
};
