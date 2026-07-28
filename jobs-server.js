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
  const { title, company, location, contract, tag, salary, description, recruiterEmail, verified } = req.body;

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
    verified: !!verified,
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

/* ========================================================
   CANDIDATURES
   ======================================================== */
const APPLICATIONS_FILE = path.join(__dirname, 'applications.json');

function loadApplications() {
  if (!fs.existsSync(APPLICATIONS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(APPLICATIONS_FILE, 'utf8'));
  } catch {
    return [];
  }
}
function saveApplications(apps) {
  fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(apps, null, 2));
}

/* ---------- Route : postuler à une offre ---------- */
app.post('/applications', (req, res) => {
  const { jobId, jobTitle, company, recruiterEmail, candidateEmail, candidateName, candidatePhone, cv } = req.body;

  if (!jobTitle || !recruiterEmail || !candidateEmail) {
    return res.status(400).json({ error: "Informations manquantes pour la candidature." });
  }

  const apps = loadApplications();

  const alreadyApplied = apps.some(a =>
    a.jobTitle === jobTitle && a.company === company &&
    a.candidateEmail === candidateEmail.toLowerCase().trim()
  );
  if (alreadyApplied) {
    return res.status(400).json({ error: "Vous avez déjà postulé à cette offre." });
  }

  const application = {
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    jobId: jobId || '',
    jobTitle,
    company: company || '',
    recruiterEmail: recruiterEmail.toLowerCase().trim(),
    candidateEmail: candidateEmail.toLowerCase().trim(),
    candidateName: candidateName || '',
    candidatePhone: candidatePhone || '',
    cv: cv || null,
    status: 'pending',
    createdAt: Date.now()
  };

  apps.unshift(application);
  saveApplications(apps);
  res.json({ success: true, application });
});

/* ---------- Route : candidatures reçues par un recruteur ---------- */
app.get('/applications/recruiter', (req, res) => {
  const email = (req.query.email || '').toLowerCase().trim();
  if (!email) return res.status(400).json({ error: "Paramètre 'email' requis." });
  const apps = loadApplications().filter(a => a.recruiterEmail === email);
  res.json({ applications: apps });
});

/* ---------- Route : candidatures envoyées par un candidat ---------- */
app.get('/applications/candidate', (req, res) => {
  const email = (req.query.email || '').toLowerCase().trim();
  if (!email) return res.status(400).json({ error: "Paramètre 'email' requis." });
  const apps = loadApplications().filter(a => a.candidateEmail === email);
  res.json({ applications: apps });
});

/* ---------- Route : mettre à jour le statut d'une candidature ---------- */
app.patch('/applications/:id', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'interview', 'accepted', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Statut invalide." });
  }

  const apps = loadApplications();
  const app_ = apps.find(a => a.id === req.params.id);
  if (!app_) return res.status(404).json({ error: "Candidature introuvable." });

  app_.status = status;
  saveApplications(apps);
  res.json({ success: true, application: app_ });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur des offres actif sur le port ${PORT}`);
});

