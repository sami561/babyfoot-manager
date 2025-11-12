import "dotenv/config";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import GameRoutes from "./routes/game.routes.js";
import ChatRouter from "./routes/chat.route.js";
import { init as websocketInit } from "./utils/websocket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.get("/test", (_, res) => res.json({ test: true }));
app.use("/api", GameRoutes);
app.use("/api", ChatRouter);
app.use(express.static(path.join(__dirname, "../../frontend")));

websocketInit(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on :${PORT}`));
