#!/bin/bash
# ─────────────────────────────────────────────
# ML11 MES POC — GitHub Push Script
# ─────────────────────────────────────────────
# Usage:
#   chmod +x push.sh
#   ./push.sh <your-github-repo-url>
#
# Example:
#   ./push.sh https://github.com/youruser/ml11-mes-poc.git
# ─────────────────────────────────────────────

set -e

REPO_URL=$1

if [ -z "$REPO_URL" ]; then
  echo "❌ Please provide your GitHub repo URL"
  echo "   Usage: ./push.sh https://github.com/youruser/ml11-mes-poc.git"
  exit 1
fi

echo "📦 Initializing git repository..."
git init

echo "📝 Adding all files..."
git add -A

echo "✅ Creating initial commit..."
git commit -m "feat: MES POC v2 — Micro Labs ML11

13-module Manufacturing Execution System proof-of-concept
- Dashboard, Templates, Batch Execution, Materials & Dispensing
- Equipment, IPC & Controls, Sampling & Labels, Deviations & CAPA
- E-Logbooks, Integration Hub, Reports, Compliance, Users & Access
- 12 equipment items from Annexure-I, 6 balances, 7 active batches
- 21 CFR Part 11 | GAMP5 Cat 5 | ALCOA+ compliance alignment
- Built against URS:ML11:25:0009"

echo "🔗 Adding remote..."
git remote add origin "$REPO_URL"
git branch -M main

echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Your repo is live at: $REPO_URL"
echo "👉 Now connect it to Vercel at https://vercel.com/new"
