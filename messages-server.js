/* ==========================================================
   Job Univers — Serveur de messagerie candidat ↔ recruteur
   Installation : npm install express cors
   Lancement    : node messages-server.js
   ========================================================== */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.MESSAGES_PORT || 3001;
const DATA_FILE = path.join(__dirname, 'messages.json');

/* ---------- Chargement / sauvegarde des messages sur disque ---------- */
function loadMessages() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveMessages(messages) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
}

/* ---------- Route : envoyer un message ---------- */
app.post('/messages', (req, res) => {
  const { from, to, text } = req.body;

  if (!from || !to || !text || !text.trim()) {
    return res.status(400).json({ error: "Champs manquants (from, to, text)." });
  }

  const messages = loadMessages();
  const message = {
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    from: from.toLowerCase().trim(),
    to: to.toLowerCase().trim(),
    text: text.trim(),
    timestamp: Date.now()
  };
  messages.push(message);
  saveMessages(messages);

  res.json({ success: true, message });
});

/* ---------- Route : récupérer une conversation entre deux personnes ---------- */
app.get('/messages', (req, res) => {
  const a = (req.query.a || '').toLowerCase().trim();
  const b = (req.query.b || '').toLowerCase().trim();

  if (!a || !b) {
    return res.status(400).json({ error: "Paramètres 'a' et 'b' requis (adresses e-mail)." });
  }

  const messages = loadMessages().filter(m =>
    (m.from === a && m.to === b) || (m.from === b && m.to === a)
  );

  res.json({ messages });
});

/* ---------- Route : liste des conversations d'un utilisateur ---------- */
app.get('/conversations', (req, res) => {
  const user = (req.query.user || '').toLowerCase().trim();
  if (!user) return res.status(400).json({ error: "Paramètre 'user' requis." });

  const messages = loadMessages().filter(m => m.from === user || m.to === user);
  const others = new Map();

  messages.forEach(m => {
    const other = m.from === user ? m.to : m.from;
    const existing = others.get(other);
    if (!existing || m.timestamp > existing.timestamp) {
      others.set(other, { with: other, lastMessage: m.text, timestamp: m.timestamp });
    }
  });

  const list = Array.from(others.values()).sort((a, b) => b.timestamp - a.timestamp);
  res.json({ conversations: list });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur de messagerie actif sur le port ${PORT}`);
});

