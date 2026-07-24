#!/bin/bash
# ==========================================================
# Job Univers — Surveillance en temps réel
# Relance automatiquement les tests dès qu'un fichier change,
# et vérifie que le serveur répond toujours.
# Usage : bash watch-site.sh
# Arrêt : Ctrl+C
# ==========================================================

FILES="index.html login.html chatbot.js"
PORT=8081

echo "👁️  Surveillance en temps réel — Job Univers"
echo "=============================================="
echo "Fichiers surveillés : $FILES"
echo "Serveur attendu sur : localhost:$PORT"
echo "Appuyez sur CTRL+C pour arrêter."
echo ""

# --- Mémorise l'état initial (date de modification de chaque fichier) ---
declare -A last_mod
for f in $FILES; do
  if [ -f "$f" ]; then
    last_mod[$f]=$(stat -c %Y "$f" 2>/dev/null)
  fi
done

# --- Vérifie une fois au démarrage ---
run_tests() {
  echo ""
  echo "🔄 Changement détecté — relance des tests..."
  echo "----------------------------------------------"
  if [ -f test-site.sh ]; then
    bash test-site.sh
  else
    echo "⚠️  test-site.sh introuvable dans ce dossier."
  fi

  if [ -f security-check.sh ]; then
    bash security-check.sh
  else
    echo "⚠️  security-check.sh introuvable dans ce dossier."
  fi
  echo ""
}

check_server() {
  if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT" | grep -q "200"; then
    echo "🟢 Serveur OK (localhost:$PORT répond)"
  else
    echo "🔴 Serveur injoignable sur localhost:$PORT — vérifiez qu'il tourne (http-server -p $PORT)"
  fi
}

echo "🔍 Vérification initiale..."
check_server
run_tests

# --- Boucle de surveillance ---
while true; do
  sleep 3
  CHANGED=0
  for f in $FILES; do
    if [ -f "$f" ]; then
      new_mod=$(stat -c %Y "$f" 2>/dev/null)
      if [ "${last_mod[$f]}" != "$new_mod" ]; then
        last_mod[$f]=$new_mod
        CHANGED=1
      fi
    fi
  done

  if [ "$CHANGED" -eq 1 ]; then
    check_server
    run_tests
  fi
done

