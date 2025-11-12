import { Router } from "express";
import * as chat from "../handlers/chatRestHandlers.js"; // NOW exists

const router = Router();

router.get("/chat", chat.getChat);
router.post("/chat", chat.postChat);

export default router;
