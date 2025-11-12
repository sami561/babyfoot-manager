import { broadcast } from "./websocket.js"; 
import * as chat from "../models/Chat.js";

export function handleChatMessage(ws, wss) {
  ws.on("message", async (data) => {
    let parsed;
    try {
      parsed = JSON.parse(data.toString());
    } catch {
      return;
    } 

    if (parsed.type === "chat") {
      const saved = await chat.chatInsert(parsed.user || "Anon", parsed.text);

      broadcast({ type: "chat", ...saved }); 
    }
  });
}
