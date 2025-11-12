const API = "http://localhost:3000/api";
const WS_URL = `ws://${location.hostname}:3000`;

const $ = (sel) => document.querySelector(sel);
const log = (...a) => console.log("[Baby]", ...a);

let ws;
let lastGamesHash = "";
let unread = 0;

initWS();
loadGames();
$("#addBtn").addEventListener("click", createGame);
$("#newGameInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") createGame(e);
});

function initWS() {
  ws = new WebSocket(WS_URL);
  ws.onopen = () => log("WS connected");
  ws.onclose = () => (
    log("WS closed – retry in 2 s"), setTimeout(initWS, 2000)
  );
  ws.onmessage = (evt) => {
    loadGames();
    try {
      const msg = JSON.parse(evt.data);
      if (msg.type === "chat") appendChat(msg);
    } catch {}
  };
}

async function loadGames() {
  const games = await (await fetch(`${API}/games`)).json();
  const hash = JSON.stringify(games);
  if (hash === lastGamesHash) return;
  lastGamesHash = hash;

  const list = $("#gamesList");
  list.innerHTML = "";
  let ongoing = 0;

  games.forEach((g) => {
    if (!g.finished) ongoing++;

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="game-item">
        <div class="checkbox ${g.finished ? "checked" : ""}"
             data-id="${g.id}" data-finished="${g.finished}"></div>
        <span class="game-text ${g.finished ? "completed" : ""}">
          ${g.player1} vs ${g.player2}
        </span>
      </div>
      <button class="delete-btn" data-id="${g.id}"></button>
    `;
    list.appendChild(li);
  });

  $("#counter").textContent = ongoing;

  list
    .querySelectorAll(".checkbox")
    .forEach((box) =>
      box.addEventListener("click", (e) => toggleFinish(e.target.dataset.id))
    );
  list
    .querySelectorAll(".delete-btn")
    .forEach((btn) =>
      btn.addEventListener("click", (e) => deleteGame(e.target.dataset.id))
    );
}

async function createGame(e) {
  e.preventDefault();
  const raw = $("#newGameInput").value.trim();
  if (!raw) return;

  const parts = raw
    .split(/vs|,|\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length !== 2) return alert("Format :  Joueur1 vs Joueur2");

  await fetch(`${API}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player1: parts[0], player2: parts[1] }),
  });
  $("#newGameInput").value = "";
}

async function toggleFinish(id) {
  const box = $(`.checkbox[data-id="${id}"]`);
  const currently = box.dataset.finished === "true";

  if (!currently) {
    box.classList.add("checked");
    box.dataset.finished = "true";
    box.closest("li").querySelector(".game-text").classList.add("completed");

    const btn = box.closest("li").querySelector(".delete-btn");
    btn.style.opacity = ".3";
    btn.style.pointerEvents = "none";

    setTimeout(async () => {
      if (box.dataset.finished === "true") {
        await fetch(`${API}/games/${id}/finish`, { method: "PUT" });
      }
      btn.style.opacity = "";
      btn.style.pointerEvents = "";
    }, 2000);
  } else {
    box.classList.remove("checked");
    box.dataset.finished = "false";
    box.closest("li").querySelector(".game-text").classList.remove("completed");
  }
}

async function deleteGame(id) {
  if (!confirm("Supprimer cette partie ?")) return;
  await fetch(`${API}/games/${id}`, { method: "DELETE" });
}

const chatForm = $("#chatForm");
const input = $("#input");
const username = $("#username");
const messages = $("#messages");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!input.value.trim()) return;

  ws.send(
    JSON.stringify({
      type: "chat",
      user: username.value.trim() || "Moi",
      text: input.value.trim(),
    })
  );
  input.value = "";
});

function appendChat({ user, text, created_at }) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="chat-text">${escapeHTML(text)}</span>
    <span class="chat-user">${escapeHTML(user)}</span>
  `;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;

  if (!li.matches(":hover")) unread++;
  $("#chatCounter").textContent = unread;
  li.onmouseenter = () => {
    unread = 0;
    $("#chatCounter").textContent = 0;
  };
}

function escapeHTML(str) {
  return str.replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        m
      ])
  );
}
