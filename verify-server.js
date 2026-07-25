/* ==========================================================
   Job Univers — Serveur d'envoi de codes de validation
   Nécessite : Node.js (déjà installé), Express, Nodemailer
   Installation : npm install express nodemailer cors dotenv
   Lancement    : node verify-server.js
   ========================================================== */

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.VERIFY_PORT || 3000;

/* ---------- Stockage temporaire des codes (en mémoire) ---------- */
// Format : { "email@exemple.com": { code: "123456", expires: timestamp } }
const codes = {};
const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/* ---------- Configuration de l'envoi d'e-mail ---------- */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // ex: votreadresse@gmail.com
    pass: process.env.EMAIL_PASS    // mot de passe d'application (pas le mot de passe normal)
  }
});

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 chiffres
}

/* ---------- Route : envoyer un code ---------- */
app.post('/send-code', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: "Adresse e-mail invalide." });
  }

  const code = generateCode();
  codes[email] = { code, expires: Date.now() + CODE_TTL_MS };

  try {
    await transporter.sendMail({
      from: `"Job Univers" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Votre code de validation — Job Univers",
      html: `
        <div style="font-family:Arial,sans-serif; max-width:420px; margin:auto;">
          <h2 style="color:#0F1B2D;">Job Univers</h2>
          <p>Voici votre code de validation d'inscription :</p>
          <p style="font-size:28px; font-weight:bold; letter-spacing:6px; color:#0F1B2D;">${code}</p>
          <p style="color:#5B6470; font-size:13px;">Ce code expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
        </div>
      `
    });
    res.json({ success: true, message: "Code envoyé." });
  } catch (err) {
    console.error("Erreur d'envoi :", err.message);
    res.status(500).json({ error: "Échec de l'envoi de l'e-mail." });
  }
});

/* ---------- Route : vérifier un code ---------- */
app.post('/verify-code', (req, res) => {
  const { email, code } = req.body;
  const record = codes[email];

  if (!record) {
    return res.status(400).json({ error: "Aucun code n'a été envoyé à cette adresse." });
  }
  if (Date.now() > record.expires) {
    delete codes[email];
    return res.status(400).json({ error: "Ce code a expiré. Demandez-en un nouveau." });
  }
  if (record.code !== code) {
    return res.status(400).json({ error: "Code incorrect." });
  }

  delete codes[email]; // usage unique
  res.json({ success: true, message: "E-mail validé avec succès." });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur de validation actif sur le port ${PORT}`);
});

