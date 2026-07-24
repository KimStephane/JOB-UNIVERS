#!/bin/bash
# ==========================================================
# Job Univers — Script de test automatique
# Vérifie : structure HTML valide + liens internes non cassés
# Usage : bash test-site.sh
# ==========================================================

echo "🔍 Vérification du projet Job Univers"
echo "======================================"
echo ""

# --- 1. Validation HTML ---
if ! command -v html-validate &> /dev/null; then
  echo "⚠️  html-validate n'est pas installé."
  echo "    Installez-le avec : npm install -g html-validate"
  echo ""
else
  echo "📄 Validation de la structure HTML..."
  echo "--------------------------------------"
  for file in *.html; do
    if [ -f "$file" ]; then
      echo ""
      echo "→ $file"
      html-validate "$file" && echo "  ✅ Aucune erreur de structure"
    fi
  done
  echo ""
fi

# --- 2. Vérification des liens internes ---
echo "🔗 Vérification des liens internes (href=\"...\")..."
echo "----------------------------------------------------"
for file in *.html; do
  if [ -f "$file" ]; then
    grep -oE 'href="[^"]+"' "$file" | sed 's/href="//;s/"//' | while read -r link; do
      # ignore les liens externes, ancres et placeholders
      case "$link" in
        http*|"#"|mailto:*) continue ;;
      esac
      if [ ! -f "$link" ]; then
        echo "  ❌ $file → lien cassé : $link (fichier introuvable)"
      fi
    done
  fi
done
echo ""

# --- 3. Vérification qu'aucun fichier externe (https://) ne traîne ---
echo "🌐 Vérification des dépendances externes restantes..."
echo "-------------------------------------------------------"
EXTERNAL=$(grep -l "https://" *.html 2>/dev/null)
if [ -z "$EXTERNAL" ]; then
  echo "  ✅ Aucune dépendance externe trouvée"
else
  echo "  ⚠️  Dépendances externes détectées dans :"
  echo "$EXTERNAL" | sed 's/^/     /'
fi

echo ""
echo "======================================"
echo "✅ Vérification terminée."

