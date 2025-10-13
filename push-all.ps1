# PowerShell script to push to both GitHub and GitLab simultaneously
Write-Host "🚀 Pushing to both GitHub and GitLab..." -ForegroundColor Green

# Push to GitHub (origin)
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ GitHub push successful!" -ForegroundColor Green
} else {
    Write-Host "❌ GitHub push failed!" -ForegroundColor Red
    exit 1
}

# Push to GitLab
Write-Host "📤 Pushing to GitLab..." -ForegroundColor Yellow
git push gitlab main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ GitLab push successful!" -ForegroundColor Green
} else {
    Write-Host "❌ GitLab push failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Successfully pushed to both repositories!" -ForegroundColor Green
Write-Host "🔗 GitHub: https://github.com/AnhBoHelloTeam/123fakturera_BE" -ForegroundColor Cyan
Write-Host "🔗 GitLab: https://gitlab.com/AnhBoHelloTeam/123fakturera_BE" -ForegroundColor Cyan
