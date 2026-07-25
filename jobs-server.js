/* ==========================================================
   Job Univers — Serveur des offres publiées
   Installation : npm install express cors
   Lancement    : node jobs-server.js
   ========================================================== */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.JOBS_PORT || 3002;
const DATA_FILE = path.join(__dirname, 'jobs.json');

function loadJobs() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveJobs(jobs) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2));
}

/* ---------- Route : publier une offre ---------- */
app.post('/jobs', (req, res) => {
  const { title, company, location, contract, tag, salary, description, recruiterEmail } = req.body;

  if (!title || !company || !recruiterEmail) {
    return res.status(400).json({ error: "Titre, entreprise et e-mail recruteur sont requis." });
  }

  const jobs = loadJobs();
  const job = {
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    title: title.trim(),
    company: company.trim(),
    location: (location || 'Non précisé').trim(),
    contract: (contract || 'Non précisé').trim(),
    tag: (tag || 'Général').trim(),
    salary: (salary || 'Salaire à négocier').trim(),
    description: (description || '').trim(),
    recruiterEmail: recruiterEmail.trim().toLowerCase(),
    createdAt: Date.now()
  };
  jobs.unshift(job); // les plus récentes en premier
  saveJobs(jobs);

  res.json({ success: true, job });
});

/* ---------- Route : lister toutes les offres ---------- */
app.get('/jobs', (req, res) => {
  res.json({ jobs: loadJobs() });
});

/* ---------- Route : lister les offres d'un recruteur précis ---------- */
app.get('/jobs/mine', (req, res) => {
  const email = (req.query.email || '').toLowerCase().trim();
  if (!email) return res.status(400).json({ error: "Paramètre 'email' requis." });
  const jobs = loadJobs().filter(j => j.recruiterEmail === email);
  res.json({ jobs });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur des offres actif sur le port ${PORT}`);
});

