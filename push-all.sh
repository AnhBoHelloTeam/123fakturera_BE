#!/bin/bash

# Script to push to both GitHub and GitLab simultaneously
echo "🚀 Pushing to both GitHub and GitLab..."

# Push to GitHub (origin)
echo "📤 Pushing to GitHub..."
git push origin main

# Push to GitLab
echo "📤 Pushing to GitLab..."
git push gitlab main

echo "✅ Successfully pushed to both repositories!"
echo "🔗 GitHub: https://github.com/AnhBoHelloTeam/123fakturera_BE"
echo "🔗 GitLab: https://gitlab.com/your-username/123fakturera_BE"
