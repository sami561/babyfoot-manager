import pool from "../utils/db.js";

export const chatInsert = (user, text) =>
  pool
    .query(
      "INSERT INTO chat(username,text,created_at) VALUES($1,$2,NOW()) RETURNING *",
      [user, text]
    )
    .then((r) => r.rows[0]);

export const chatList = () =>
  pool
    .query("SELECT * FROM chat ORDER BY created_at DESC LIMIT 100")
    .then((r) => r.rows);
