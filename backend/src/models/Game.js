import pool from "../utils/db.js";

export const list = () =>
  pool.query("SELECT * FROM games ORDER BY id DESC").then((r) => r.rows);
export const insert = (p1, p2) =>
  pool.query("INSERT INTO games (player1, player2) VALUES ($1,$2)", [p1, p2]);
export const finish = (id) =>
  pool.query("UPDATE games SET finished=true WHERE id=$1", [id]);
export const remove = (id) => pool.query("DELETE FROM games WHERE id=$1", [id]);
