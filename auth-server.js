/* ==========================================================
   Job Univers — Serveur d'authentification
   Gère : création de compte, connexion sécurisée,
          mot de passe oublié / réinitialisation.
   Installation : npm install express nodemailer cors dotenv
   Lancement    : node auth-server.js
   ========================================================== */

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.AUTH_PORT || 3003;
const USERS_FILE = path.join(__dirname, 'users.json');

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 heure

/* ---------- Envoi d'e-mail ---------- */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ---------- Stockage des utilisateurs ---------- */
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); } catch { return {}; }
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function hashPassword(password, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}
function verifyPassword(password, salt, hash) {
  const check = crypto.scryptSync(password, salt, 64).toString('hex');
  return check === hash;
}

/* ---------- Route : créer un compte (mot de passe) ---------- */
app.post('/register', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: "E-mail et mot de passe (8 caractères min.) requis." });
  }

  const users = loadUsers();
  const key = email.toLowerCase().trim();
  const { salt, hash } = hashPassword(password);

  users[key] = {
    email: key,
    role: role || 'candidat',
    salt, hash,
    failedAttempts: 0,
    lockedUntil: null
  };
  saveUsers(users);
  res.json({ success: true });
});

/* ---------- Route : connexion sécurisée ---------- */
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "E-mail et mot de passe requis." });
  }

  const users = loadUsers();
  const key = email.toLowerCase().trim();
  const user = users[key];

  if (!user) {
    return res.status(401).json({ error: "Adresse e-mail ou mot de passe incorrect." });
  }

  if (user.lockedUntil && Date.now() < user.lockedUntil) {
    const minutesLeft = Math.ceil((user.lockedUntil - Date.now()) / 60000);
    return res.status(423).json({ error: `Compte temporairement verrouillé. Réessayez dans ${minutesLeft} min.` });
  }

  const valid = verifyPassword(password, user.salt, user.hash);

  if (!valid) {
    user.failedAttempts = (user.failedAttempts || 0) + 1;
    if (user.failedAttempts >= MAX_ATTEMPTS) {
      user.lockedUntil = Date.now() + LOCK_DURATION_MS;
      user.failedAttempts = 0;
      saveUsers(users);
      return res.status(423).json({ error: "Trop de tentatives échouées. Compte verrouillé 15 minutes." });
    }
    saveUsers(users);
    return res.status(401).json({ error: "Adresse e-mail ou mot de passe incorrect." });
  }

  user.failedAttempts = 0;
  user.lockedUntil = null;
  saveUsers(users);
  res.json({ success: true, role: user.role });
});

/* ---------- Mot de passe oublié ---------- */
const resetTokens = {}; // { token: { email, expires } }

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const users = loadUsers();
  const key = (email || '').toLowerCase().trim();

  if (!users[key]) {
    // Ne révèle pas si le compte existe ou non (sécurité)
    return res.json({ success: true });
  }

  // Invalide tous les anciens liens en attente pour cet e-mail :
  // seul le dernier lien envoyé reste valide.
  Object.keys(resetTokens).forEach(t => {
    if (resetTokens[t].email === key) delete resetTokens[t];
  });

  const token = crypto.randomBytes(24).toString('hex');
  resetTokens[token] = { email: key, expires: Date.now() + RESET_TOKEN_TTL_MS };

  const resetLink = `${req.headers.origin || 'http://localhost:8081'}/reset-password.html?token=${token}`;

  try {
    await transporter.sendMail({
      from: `"Job Univers" <${process.env.EMAIL_USER}>`,
      to: key,
      subject: "Réinitialisation de votre mot de passe — Job Univers",
      html: `
        <div style="font-family:Arial,sans-serif; max-width:420px; margin:auto;">
          <h2 style="color:#0F1B2D;">Job Univers</h2>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p><a href="${resetLink}" style="background:#0F1B2D;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;">Réinitialiser mon mot de passe</a></p>
          <p style="color:#5B6470; font-size:13px;">Ce lien expire dans 1 heure et remplace tout lien précédemment envoyé. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
        </div>
      `
    });
  } catch (err) {
    console.error("Erreur d'envoi :", err.message);
  }

  res.json({ success: true });
});

/* ---------- Réinitialiser le mot de passe ---------- */
app.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  const record = resetTokens[token];

  if (!record) {
    return res.status(400).json({ error: "Lien invalide ou déjà utilisé." });
  }
  if (Date.now() > record.expires) {
    delete resetTokens[token];
    return res.status(400).json({ error: "Ce lien a expiré. Refaites une demande." });
  }
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "Le mot de passe doit contenir au moins 8 caractères." });
  }

  const users = loadUsers();
  const user = users[record.email];
  if (!user) return res.status(400).json({ error: "Compte introuvable." });

  const { salt, hash } = hashPassword(newPassword);
  user.salt = salt;
  user.hash = hash;
  user.failedAttempts = 0;
  user.lockedUntil = null;
  saveUsers(users);

  delete resetTokens[token];
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur d'authentification actif sur le port ${PORT}`);
});

