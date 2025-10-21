# Simple PowerShell script to push to both GitHub and GitLab
Write-Host "Pushing to both GitHub and GitLab..." -ForegroundColor Green

# Push to GitHub (origin)
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

# Push to GitLab
Write-Host "Pushing to GitLab..." -ForegroundColor Yellow
git push gitlab main

Write-Host "Successfully pushed to both repositories!" -ForegroundColor Green