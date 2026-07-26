#!/bin/bash
# ==========================================================
# Job Univers — Redémarrage propre de tous les serveurs
# Arrête les anciens serveurs, puis relance tout sans cache
# pour que chaque modification soit visible immédiatement.
# Usage : bash restart-all.sh
# ==========================================================

echo "🔄 Arrêt des anciens serveurs..."
pkill -f "http-server" 2>/dev/null
pkill -f "node verify-server.js" 2>/dev/null
pkill -f "node messages-server.js" 2>/dev/null
pkill -f "node jobs-server.js" 2>/dev/null
sleep 1

echo "🚀 Relance des serveurs (sans cache)..."
echo ""

nohup http-server -p 8081 -c-1 > server-web.log 2>&1 &
echo "  ✅ Serveur web (8081) — cache désactivé"

nohup node verify-server.js > server-verify.log 2>&1 &
echo "  ✅ Serveur de validation e-mail (3000)"

nohup node messages-server.js > server-messages.log 2>&1 &
echo "  ✅ Serveur de messagerie (3001)"

nohup node jobs-server.js > server-jobs.log 2>&1 &
echo "  ✅ Serveur des offres (3002)"

sleep 2
echo ""
echo "======================================"
echo "🔍 Vérification que tout tourne bien..."
echo ""

for port in 8081 3000 3001 3002; do
  if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port" | grep -qE "200|404"; then
    echo "  🟢 Port $port : actif"
  else
    echo "  🔴 Port $port : ne répond pas"
  fi
done

echo ""
echo "✅ Tous les serveurs sont relancés."
echo "   Ouvrez localhost:8081 dans le navigateur — les modifications"
echo "   les plus récentes seront toujours affichées, sans cache."

