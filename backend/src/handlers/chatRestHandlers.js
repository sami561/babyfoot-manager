import * as Chat from "../models/Chat.js";

export const getChat = async (_req, res, next) => {
  try {
    res.json(await Chat.chatList());
  } catch (e) {
    next(e);
  }
};

export const postChat = async (req, res, next) => {
  try {
    const { user, text } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });
    const saved = await Chat.chatInsert(user || "Anonymous", text);
    res.status(201).json(saved);
  } catch (e) {
    next(e);
  }
};
