import { WebSocketServer } from "ws";
import { handleChatMessage } from "../handlers/chatWs.js";

let wss;

export const init = (server) => {
  wss = new WebSocketServer({ server });
  wss.on("connection", (ws) => {
    handleChatMessage(ws, wss);
  });
};

export const broadcast = (data) => {
  if (!wss) return;
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(payload);
  });
};
